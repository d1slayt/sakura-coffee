import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/**
 * Database outage behaviour, against a server that doesn't exist: API routes
 * answer 503 with a generic message, and Server Actions return a friendly
 * error instead of throwing. No internal details reach the client.
 */
describe("when PostgreSQL is unreachable", () => {
  const original = process.env.DATABASE_URL;

  beforeAll(() => {
    process.env.DATABASE_URL = "postgres://nobody:nothing@127.0.0.1:1/none";
    // Fresh module graph so the Prisma client is created with the bad URL.
    vi.resetModules();
    delete (globalThis as { prisma?: unknown }).prisma;
  });

  afterAll(() => {
    process.env.DATABASE_URL = original;
    vi.resetModules();
    delete (globalThis as { prisma?: unknown }).prisma;
  });

  it("menu API returns 503 without leaking details", async () => {
    const { GET } = await import("@/app/api/menu/items/route");
    const res = await GET(new NextRequest("http://localhost/api/menu/items"));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error.code).toBe("SERVICE_UNAVAILABLE");
    expect(JSON.stringify(body)).not.toMatch(/127\.0\.0\.1|prisma|P1001/i);
  });

  it("health check reports the database as down", async () => {
    const { GET } = await import("@/app/api/health/route");
    const res = await GET();
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ status: "degraded", database: "down" });
  });

  it("contact action fails gracefully", async () => {
    const { submitContact } = await import("@/server/actions");
    const fd = new FormData();
    for (const [k, v] of Object.entries({
      website: "",
      startedAt: String(Date.now() - 10_000),
      name: "Иван",
      email: "ivan@integration.sakura.test",
      topic: "GENERAL",
      message: "Сообщение при недоступной базе.",
    }))
      fd.set(k, v);
    const state = await submitContact({ status: "idle" }, fd);
    expect(state).toMatchObject({ status: "error", message: expect.stringMatching(/Не удалось сохранить/) });
  });
});
