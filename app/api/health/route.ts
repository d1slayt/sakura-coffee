import { connection } from "next/server";
import { getDb } from "@/lib/db/client";
import { logServerError } from "@/lib/db/errors";

/** GET /api/health — liveness plus a database round-trip. */
export async function GET() {
  await connection();
  try {
    await getDb().$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", database: "up" }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    logServerError("GET /api/health", error);
    return Response.json(
      { status: "degraded", database: "down" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
