import { z } from "zod";
import { getDictionary } from "@/lib/i18n";
import { isIsoDate } from "@/lib/time";

/** Validation messages in the site language. */
export const messages = getDictionary().validation;

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, messages.email)
  .pipe(z.email(messages.email));

export const isoDateSchema = z.string().trim().refine(isIsoDate, messages.date);

/** Field-level error messages keyed by field name, safe to send to the client. */
export type FieldErrors<T> = Partial<Record<keyof T & string, string>>;

export function firstFieldErrors<T>(error: z.ZodError<T>): FieldErrors<T> {
  const flat = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  const result: Record<string, string> = {};
  for (const [key, list] of Object.entries(flat)) {
    if (list?.[0]) result[key] = list[0];
  }
  return result as FieldErrors<T>;
}
