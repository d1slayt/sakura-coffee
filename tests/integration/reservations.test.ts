import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getDb } from "@/lib/db/client";
import { brewBar } from "@/lib/booking";
import { createReservation, getAvailability } from "@/server/reservations";
import { bookableDate, hasDatabase, TEST_DOMAIN, testEmail } from "./helpers";

const cleanup = () => getDb().reservation.deleteMany({ where: { email: { endsWith: `@${TEST_DOMAIN}` } } });

describe.skipIf(!hasDatabase)("reservations (PostgreSQL)", () => {
  beforeAll(cleanup);
  afterAll(cleanup);

  it("creates a PENDING reservation with a reference", async () => {
    const date = bookableDate(10);
    const result = await createReservation({ name: "Тест", email: testEmail("one"), date, time: "13:00", partySize: 2 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reference).toMatch(/^SC-[A-Z2-9]{6}$/);

    const row = await getDb().reservation.findUniqueOrThrow({ where: { reference: result.reference } });
    expect(row.status).toBe("PENDING");
    expect(row.partySize).toBe(2);
  });

  it("never overbooks a session under concurrent requests", async () => {
    const date = bookableDate(11);
    // 6 seats; 5 parallel requests for 2 seats each → exactly 3 can succeed.
    const results = await Promise.all(
      Array.from({ length: 5 }, (_, i) =>
        createReservation({ name: `Гость ${i}`, email: testEmail(`race${i}`), date, time: "09:00", partySize: 2 }),
      ),
    );
    const ok = results.filter((r) => r.ok);
    expect(ok).toHaveLength(brewBar.seatsPerSession / 2);
    for (const r of results) if (!r.ok) expect(["NOT_ENOUGH_SEATS", "BUSY"]).toContain(r.error);

    const availability = await getAvailability(date);
    expect(availability.bookable).toBe(true);
    if (availability.bookable) {
      expect(availability.slots.find((s) => s.time === "09:00")).toMatchObject({ seatsLeft: 0, available: false });
      expect(availability.slots.find((s) => s.time === "10:00")).toMatchObject({ seatsLeft: 6, available: true });
    }
  });

  it("rejects a duplicate booking for the same email and session", async () => {
    const date = bookableDate(12);
    const email = testEmail("dup");
    expect((await createReservation({ name: "Тест", email, date, time: "11:00", partySize: 1 })).ok).toBe(true);
    expect(await createReservation({ name: "Тест", email, date, time: "11:00", partySize: 1 })).toEqual({
      ok: false,
      error: "DUPLICATE",
    });
  });

  it("applies calendar rules on the server", async () => {
    expect(await createReservation({ name: "Тест", email: testEmail("past"), date: "2020-01-07", time: "10:00", partySize: 1 })).toEqual({
      ok: false,
      error: "TOO_SOON",
    });
    const availability = await getAvailability("2020-01-07");
    expect(availability).toMatchObject({ bookable: false, reason: "TOO_SOON" });
  });
});
