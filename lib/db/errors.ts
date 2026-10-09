import { Prisma } from "@/lib/generated/prisma/client";

export class DatabaseUnavailableError extends Error {
  constructor(message = "Database unavailable") {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

const CONNECTION_ERROR_CODES = new Set([
  "P1000", // authentication failed
  "P1001", // can't reach database server
  "P1002", // server timed out
  "P1003", // database does not exist
  "P1017", // server closed the connection
  "P2024", // timed out fetching a connection from the pool
]);

const NETWORK_ERROR_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "57P01", // postgres admin_shutdown
  "57P03", // postgres cannot_connect_now
]);

/** Driver-adapter error kinds (Prisma 7) that mean "can't talk to the database". */
const UNAVAILABLE_ADAPTER_KINDS = new Set([
  "DatabaseNotReachable",
  "DatabaseDoesNotExist",
  "DatabaseAccessDenied",
  "AuthenticationFailed",
  "ConnectionClosed",
  "SocketTimeout",
  "TlsConnectionError",
  "TooManyConnections",
]);

/** Raw queries surface connection failures as P2010 with the adapter error in `meta`. */
function adapterErrorKind(error: unknown): string | undefined {
  const adapterError = (error as { meta?: { driverAdapterError?: { message?: unknown; cause?: { kind?: unknown } } } } | null)
    ?.meta?.driverAdapterError;
  if (!adapterError) return undefined;
  const kind = adapterError.cause?.kind ?? adapterError.message;
  return typeof kind === "string" ? kind : undefined;
}

function errorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

/** True when the error means "the database cannot be reached right now". */
export function isDatabaseUnavailable(error: unknown): boolean {
  if (error instanceof DatabaseUnavailableError) return true;
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  const kind = adapterErrorKind(error);
  if (kind && UNAVAILABLE_ADAPTER_KINDS.has(kind)) return true;
  const code = errorCode(error);
  if (code && (CONNECTION_ERROR_CODES.has(code) || NETWORK_ERROR_CODES.has(code))) {
    return true;
  }
  const cause = (error as { cause?: unknown } | null)?.cause;
  return cause !== undefined && cause !== error ? isDatabaseUnavailable(cause) : false;
}

/** Serializable-transaction conflict; safe to retry. */
export function isSerializationFailure(error: unknown): boolean {
  const code = errorCode(error);
  return code === "P2034" || code === "40001";
}

export function isUniqueViolation(error: unknown): boolean {
  return errorCode(error) === "P2002";
}

/**
 * Logs an error without request data or personal information: only the
 * context label, error class and code. Messages from the driver can contain
 * query parameters, so they are not logged in production.
 */
export function logServerError(context: string, error: unknown): void {
  const name = error instanceof Error ? error.name : typeof error;
  const code = errorCode(error);
  const detail =
    process.env.NODE_ENV === "production"
      ? ""
      : ` ${error instanceof Error ? error.message : String(error)}`;
  console.error(`[${context}] ${name}${code ? ` (${code})` : ""}${detail}`);
}
