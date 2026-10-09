import "dotenv/config";
import { vi } from "vitest";

declare global {
  // Client IP that mocked `headers()` reports to Server Actions in tests.
  var __testClientIp: string | undefined;
}

// Outside the Next.js compiler, "use cache" is a plain string and the cache
// helpers have no cache scope to attach to, so they're no-ops in tests.
vi.mock("next/cache", () => ({
  cacheLife: () => {},
  cacheTag: () => {},
  revalidateTag: () => {},
  updateTag: () => {},
}));

// `connection()` needs a request scope; route handlers are called directly here.
vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return { ...actual, connection: async () => {} };
});

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": globalThis.__testClientIp ?? "203.0.113.10" }),
}));
