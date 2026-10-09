import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { DatabaseUnavailableError } from "./errors";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new DatabaseUnavailableError("DATABASE_URL is not configured");
  }
  // Optional pool size. Local PGlite (`prisma dev`) runs every connection in a
  // single Postgres session, so it must be used with DATABASE_POOL_MAX=1.
  const max = Number(process.env.DATABASE_POOL_MAX) || undefined;
  const adapter = new PrismaPg({ connectionString, max });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

/**
 * Returns the shared Prisma client. The client is created lazily so that
 * importing a module never fails at build time when no database is configured;
 * the error surfaces only when a query is actually attempted.
 */
export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}
