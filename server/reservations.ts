import "server-only";

import { randomBytes } from "node:crypto";
import {
  brewBar,
  checkBookingDate,
  sessionStartUtc,
  type DateRuleViolation,
  type SessionTime,
} from "@/lib/booking";
import { getDb } from "@/lib/db/client";
import { isSerializationFailure, isUniqueViolation } from "@/lib/db/errors";
import type { ReservationInput } from "@/lib/validations/reservation";

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED"] as const;

export interface SlotAvailability {
  time: SessionTime;
  seatsLeft: number;
  available: boolean;
}

export type AvailabilityResult =
  | { bookable: true; date: string; slots: SlotAvailability[] }
  | { bookable: false; date: string; reason: DateRuleViolation; slots: [] };

export async function getAvailability(date: string, now: Date = new Date()): Promise<AvailabilityResult> {
  const violation = checkBookingDate(date, now);
  if (violation) return { bookable: false, date, reason: violation, slots: [] };

  const starts = brewBar.sessionTimes.map((time) => ({ time, start: sessionStartUtc(date, time) }));
  const booked = await getDb().reservation.groupBy({
    by: ["slotStart"],
    where: {
      slotStart: { in: starts.map((s) => s.start) },
      status: { in: [...ACTIVE_STATUSES] },
    },
    _sum: { partySize: true },
  });
  const seatsTaken = new Map(booked.map((b) => [b.slotStart.getTime(), b._sum.partySize ?? 0]));

  return {
    bookable: true,
    date,
    slots: starts.map(({ time, start }) => {
      const seatsLeft = Math.max(0, brewBar.seatsPerSession - (seatsTaken.get(start.getTime()) ?? 0));
      // A slot is shown as available only if at least the minimum party fits.
      return { time, seatsLeft, available: seatsLeft >= brewBar.minPartySize };
    }),
  };
}

export type CreateReservationResult =
  | { ok: true; reference: string; slotStart: Date }
  | {
      ok: false;
      error: DateRuleViolation | "NOT_ENOUGH_SEATS" | "DUPLICATE" | "BUSY";
      seatsLeft?: number;
    };

class ReservationRejected extends Error {
  constructor(
    readonly code: "NOT_ENOUGH_SEATS" | "DUPLICATE",
    readonly seatsLeft?: number,
  ) {
    super(code);
  }
}

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

export function generateReference(): string {
  const bytes = randomBytes(6);
  let code = "";
  for (const byte of bytes) code += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
  return `SC-${code}`;
}

const MAX_ATTEMPTS = 4;

/** Advisory-lock namespace for brew-bar sessions (arbitrary, app-specific). */
const SLOT_LOCK_NAMESPACE = 7_301;

/** Session start in minutes since epoch, folded into a signed 32-bit lock key. */
export function slotLockKey(slotStart: Date): number {
  return Math.floor(slotStart.getTime() / 60_000) % 2_147_483_647;
}

/**
 * Creates a PENDING reservation if the session still has room.
 *
 * Capacity check and insert run in one transaction that first takes an
 * advisory lock for the session, so concurrent requests for the same slot
 * are processed one after another. The transaction is also SERIALIZABLE: if
 * anything ever bypasses the lock, Postgres aborts one of the conflicting
 * transactions and we retry it against the new state. Either way a session
 * can never be overbooked.
 */
export async function createReservation(
  input: ReservationInput,
  now: Date = new Date(),
): Promise<CreateReservationResult> {
  const violation = checkBookingDate(input.date, now);
  if (violation) return { ok: false, error: violation };

  const slotStart = sessionStartUtc(input.date, input.time);
  const db = getDb();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const reservation = await db.$transaction(
        async (tx) => {
          // Queue concurrent bookings for the same session behind a
          // transaction-scoped advisory lock (released on commit/rollback).
          // SERIALIZABLE below remains the safety net if the lock is bypassed.
          await tx.$executeRaw`SELECT pg_advisory_xact_lock(${SLOT_LOCK_NAMESPACE}::int, ${slotLockKey(slotStart)}::int)`;

          const [taken, duplicate] = await Promise.all([
            tx.reservation.aggregate({
              where: { slotStart, status: { in: [...ACTIVE_STATUSES] } },
              _sum: { partySize: true },
            }),
            tx.reservation.findFirst({
              where: { slotStart, email: input.email, status: { in: [...ACTIVE_STATUSES] } },
              select: { id: true },
            }),
          ]);
          if (duplicate) throw new ReservationRejected("DUPLICATE");

          const seatsLeft = brewBar.seatsPerSession - (taken._sum.partySize ?? 0);
          if (input.partySize > seatsLeft) {
            throw new ReservationRejected("NOT_ENOUGH_SEATS", Math.max(0, seatsLeft));
          }

          return tx.reservation.create({
            data: {
              reference: generateReference(),
              name: input.name,
              email: input.email,
              phone: input.phone ?? null,
              note: input.note ?? null,
              partySize: input.partySize,
              slotStart,
              // status intentionally omitted: the database default (PENDING) applies.
            },
            select: { reference: true, slotStart: true },
          });
        },
        { isolationLevel: "Serializable", maxWait: 5_000, timeout: 10_000 },
      );
      return { ok: true, reference: reservation.reference, slotStart: reservation.slotStart };
    } catch (error) {
      if (error instanceof ReservationRejected) {
        return { ok: false, error: error.code, seatsLeft: error.seatsLeft };
      }
      // Serialization conflicts and (astronomically rare) reference collisions are retryable.
      if ((isSerializationFailure(error) || isUniqueViolation(error)) && attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 15 * attempt + Math.random() * 25));
        continue;
      }
      if (isSerializationFailure(error)) return { ok: false, error: "BUSY" };
      throw error;
    }
  }
  return { ok: false, error: "BUSY" };
}
