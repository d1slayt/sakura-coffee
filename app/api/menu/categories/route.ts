import { connection } from "next/server";
import { menuQueries } from "@/server/menu";
import { handleRouteError, json } from "@/server/http";

/** GET /api/menu/categories — all menu categories in menu order. */
export async function GET() {
  // Render at request time so builds never depend on database access.
  await connection();
  try {
    return json(await menuQueries.categories(), { maxAge: 60 });
  } catch (error) {
    return handleRouteError("GET /api/menu/categories", error);
  }
}
