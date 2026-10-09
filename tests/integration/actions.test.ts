import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { getDb } from "@/lib/db/client";
import { idleState } from "@/lib/form-state";
import { submitContact, submitReservation } from "@/server/actions";
import { consumeRateLimit, rateLimits } from "@/server/rate-limit";
import { bookableDate, hasDatabase, TEST_DOMAIN, testEmail } from "./helpers";

function form(values: Record<string, string>, { human = true } = {}) {
  const fd = new FormData();
  fd.set("website", "");
  fd.set("startedAt", String(Date.now() - (human ? 15_000 : 100)));
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

let ipCounter = 0;
const freshIp = () => `198.51.100.${(ipCounter = (ipCounter % 250) + 1)}-${Date.now()}`;

describe.skipIf(!hasDatabase)("Server Actions (PostgreSQL)", () => {
  beforeEach(() => {
    globalThis.__testClientIp = freshIp();
  });
  afterAll(async () => {
    const db = getDb();
    await db.reservation.deleteMany({ where: { email: { endsWith: `@${TEST_DOMAIN}` } } });
    await db.contactMessage.deleteMany({ where: { email: { endsWith: `@${TEST_DOMAIN}` } } });
  });

  it("submitReservation stores a valid request and returns a reference", async () => {
    const state = await submitReservation(
      idleState,
      form({ name: "Анна", email: testEmail("action"), date: bookableDate(16), time: "14:00", partySize: "3", status: "CONFIRMED" }),
    );
    expect(state.status).toBe("success");
    if (state.status !== "success") return;
    const row = await getDb().reservation.findUniqueOrThrow({ where: { reference: state.reference! } });
    // The client tried to set status; the server ignored it.
    expect(row.status).toBe("PENDING");
  });

  it("submitReservation returns field errors without touching the database", async () => {
    const before = await getDb().reservation.count();
    const state = await submitReservation(idleState, form({ name: "", email: "bad", date: "x", time: "07:00", partySize: "9" }));
    expect(state.status).toBe("error");
    if (state.status === "error") {
      expect(Object.keys(state.fieldErrors ?? {}).sort()).toEqual(["date", "email", "name", "partySize", "time"]);
      expect(state.values?.email).toBe("bad");
    }
    expect(await getDb().reservation.count()).toBe(before);
  });

  it("silently drops bot submissions", async () => {
    const email = testEmail("bot");
    const state = await submitReservation(
      idleState,
      form({ name: "Бот", email, date: bookableDate(16), time: "15:00", partySize: "1" }, { human: false }),
    );
    expect(state.status).toBe("success");
    expect(await getDb().reservation.count({ where: { email } })).toBe(0);
  });

  it("submitContact stores a message with status NEW", async () => {
    const email = testEmail("contact");
    const state = await submitContact(idleState, form({ name: "Иван", email, topic: "EVENTS", message: "Хотим провести дегустацию на 12 человек." }));
    expect(state.status).toBe("success");
    const row = await getDb().contactMessage.findFirstOrThrow({ where: { email } });
    expect(row).toMatchObject({ status: "NEW", topic: "EVENTS" });
  });

  it("rate-limits by hashed client identifier", async () => {
    const id = freshIp();
    const { limit } = rateLimits.contact;
    for (let i = 0; i < limit; i++) expect((await consumeRateLimit("contact", id)).allowed).toBe(true);
    expect((await consumeRateLimit("contact", id)).allowed).toBe(false);
    // A different client is unaffected.
    expect((await consumeRateLimit("contact", freshIp())).allowed).toBe(true);
  });
});
