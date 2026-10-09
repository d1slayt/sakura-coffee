import type { NextRequest } from "next/server";
import { menuQueryFromSearchParams } from "@/lib/validations/menu";
import { menuQueries } from "@/server/menu";
import { handleRouteError, json } from "@/server/http";

/**
 * GET /api/menu/items — search and filter the menu.
 *
 * Query: `q` (text), `category` (slug), `diet` (vegan|vegetarian, repeatable),
 * `free` (gluten|milk|nuts, repeatable), `available=1`.
 * Unknown or malformed values are ignored rather than rejected.
 */
export async function GET(request: NextRequest) {
  const query = menuQueryFromSearchParams(request.nextUrl.searchParams);
  try {
    const groups = await menuQueries.search(query);
    const items = groups.flatMap((g) => g.items);
    return json({ query, count: items.length, items }, { maxAge: 60 });
  } catch (error) {
    return handleRouteError("GET /api/menu/items", error);
  }
}
