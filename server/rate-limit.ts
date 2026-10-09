import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getDb } from "@/lib/db/client";

export interface RateLimitRule {
  /** Maximum requests per window. */
  limit: number;
  windowSeconds: number;
}

export const rateLimits = {
  reservation: { limit: 5, windowSeconds: 60 * 60 },
  contact: { limit: 5, windowSeconds: 60 * 60 },
  availability: { limit: 120, windowSeconds: 60 * 10 },
} as const satisfies Record<string, RateLimitRule>;

export type RateLimitAction = keyof typeof rateLimits;

/**
 * Best-effort client IP from proxy headers. Behind a trusted proxy (Vercel,
 * Nginx) the left-most X-Forwarded-For entry is the client.
 */
export function clientIpFrom(headerList: Headers): string {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headerList.get("x-real-ip")?.trim() || "unknown";
}

/** One-way hash so raw IP addresses never reach the database or logs. */
export function hashIdentifier(value: string): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex").slice(0, 32);
}

/**
 * Fixed-window counter stored in Postgres. The upsert is a single atomic
 * statement, so concurrent requests from the same client can't both slip
 * under the limit, and it works across multiple app instances.
 */
export async function consumeRateLimit(
  action: RateLimitAction,
  identifier: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const rule = rateLimits[action];
  const key = `${action}:${hashIdentifier(identifier)}`;
  const rows = await getDb().$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimitBucket" ("key", "count", "windowStart")
    VALUES (${key}, 1, now())
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimitBucket"."windowStart" <= now() - make_interval(secs => ${rule.windowSeconds})
        THEN 1 ELSE "RateLimitBucket"."count" + 1 END,
      "windowStart" = CASE
        WHEN "RateLimitBucket"."windowStart" <= now() - make_interval(secs => ${rule.windowSeconds})
        THEN now() ELSE "RateLimitBucket"."windowStart" END
    RETURNING "count"
  `;
  const count = Number(rows[0]?.count ?? 0);
  return { allowed: count <= rule.limit, remaining: Math.max(0, rule.limit - count) };
}

/** Convenience wrapper for Server Actions, which read the request via headers(). */
export async function consumeRateLimitForRequest(action: RateLimitAction) {
  const ip = clientIpFrom(await headers());
  return consumeRateLimit(action, ip);
}
