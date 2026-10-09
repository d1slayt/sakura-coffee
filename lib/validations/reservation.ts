import { z } from "zod";
import { brewBar, isSessionTime, type SessionTime } from "@/lib/booking";
import { emailSchema, isoDateSchema, messages } from "./common";

/**
 * Shape validation for a reservation request. Calendar rules that depend on
 * the current time (booking window, closed days) are applied by the service
 * with an explicit `now`, see `checkBookingDate`.
 *
 * There is deliberately no `status` field: every request is stored as PENDING.
 */
export const reservationInputSchema = z.object({
  name: z.string().trim().min(2, messages.name).max(80, messages.nameTooLong),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .max(32, messages.phone)
    .refine((v) => v === "" || /^\+?[0-9 ()-]{6,}$/.test(v), messages.phone)
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
  date: isoDateSchema,
  time: z
    .string()
    .trim()
    .refine(isSessionTime, messages.time)
    .transform((v) => v as SessionTime),
  partySize: z.coerce
    .number({ error: messages.partySize })
    .int(messages.partySize)
    .min(brewBar.minPartySize, messages.partyMin)
    .max(brewBar.maxPartySize, messages.partyMax),
  note: z
    .string()
    .trim()
    .max(500, messages.noteTooLong)
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
});

export type ReservationInput = z.infer<typeof reservationInputSchema>;

export const availabilityQuerySchema = z.object({
  date: isoDateSchema,
});
