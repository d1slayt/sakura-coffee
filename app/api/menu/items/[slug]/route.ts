import { menuQueries } from "@/server/menu";
import { apiError, handleRouteError, json } from "@/server/http";

/** GET /api/menu/items/:slug — a single menu item. */
export async function GET(_request: Request, ctx: RouteContext<"/api/menu/items/[slug]">) {
  const { slug } = await ctx.params;
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) {
    return apiError("BAD_REQUEST", "Invalid item slug.");
  }
  try {
    const item = await menuQueries.bySlug(slug);
    if (!item) return apiError("NOT_FOUND", "No menu item with that slug.");
    return json(item, { maxAge: 60 });
  } catch (error) {
    return handleRouteError("GET /api/menu/items/[slug]", error);
  }
}
