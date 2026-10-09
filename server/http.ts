import "server-only";

import { isDatabaseUnavailable, logServerError } from "@/lib/db/errors";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR";

export interface ApiError {
  error: { code: ApiErrorCode; message: string; details?: Record<string, string> };
}

const STATUS: Record<ApiErrorCode, number> = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  SERVICE_UNAVAILABLE: 503,
  INTERNAL_ERROR: 500,
};

export function apiError(code: ApiErrorCode, message: string, details?: Record<string, string>) {
  return Response.json({ error: { code, message, details } } satisfies ApiError, {
    status: STATUS[code],
    headers: { "Cache-Control": "no-store" },
  });
}

/** Maps unexpected errors to a safe response; internal details are only logged. */
export function handleRouteError(context: string, error: unknown): Response {
  logServerError(context, error);
  if (isDatabaseUnavailable(error)) {
    return apiError("SERVICE_UNAVAILABLE", "The menu service is temporarily unavailable.");
  }
  return apiError("INTERNAL_ERROR", "Unexpected server error.");
}

export function json<T>(data: T, init?: { maxAge?: number }) {
  return Response.json(
    { data },
    {
      headers: {
        "Cache-Control": init?.maxAge
          ? `public, max-age=0, s-maxage=${init.maxAge}, stale-while-revalidate=${init.maxAge * 5}`
          : "no-store",
      },
    },
  );
}
