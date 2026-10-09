import type { NextRequest } from "next/server";
import { dateRuleMessages } from "@/lib/booking";
import { firstFieldErrors } from "@/lib/validations/common";
import { availabilityQuerySchema } from "@/lib/validations/reservation";
import { apiError, handleRouteError, json } from "@/server/http";
import { clientIpFrom, consumeRateLimit } from "@/server/rate-limit";
import { getAvailability } from "@/server/reservations";

/** GET /api/reservations/availability?date=YYYY-MM-DD — seats left per brew-bar session. */
export async function GET(request: NextRequest) {
  const parsed = availabilityQuerySchema.safeParse({
    date: request.nextUrl.searchParams.get("date") ?? "",
  });
  if (!parsed.success) {
    return apiError("BAD_REQUEST", "Invalid date.", firstFieldErrors(parsed.error));
  }

  try {
    const limit = await consumeRateLimit("availability", clientIpFrom(request.headers));
    if (!limit.allowed) return apiError("RATE_LIMITED", "Too many requests. Please slow down.");

    const result = await getAvailability(parsed.data.date);
    return json(
      result.bookable ? result : { ...result, message: dateRuleMessages[result.reason] },
    );
  } catch (error) {
    return handleRouteError("GET /api/reservations/availability", error);
  }
}
