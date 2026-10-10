import { z } from "zod";
import { getDictionary } from "@/lib/i18n";
import { isIsoDate } from "@/lib/time";
import {
  cleanLine,
  cleanText,
  containsLink,
  containsMarkup,
  emailDomainProblem,
  formatPhone,
  isPlausibleName,
  looksLikeGibberish,
  normalizePhone,
} from "./text";

/** Validation messages in the site language. */
export const messages = getDictionary().validation;

/** A person's name, cleaned of invisible characters; letters only, no digits or links. */
export const nameSchema = z
  .string()
  .transform(cleanLine)
  .pipe(z.string().min(2, messages.name).max(60, messages.nameTooLong).refine(isPlausibleName, messages.nameChars));

export const emailSchema = z
  .string()
  .transform(cleanLine)
  .transform((v) => v.toLowerCase())
  .pipe(z.string().max(254, messages.email).pipe(z.email(messages.email)))
  .superRefine((email, ctx) => {
    const problem = emailDomainProblem(email);
    if (!problem) return;
    const message =
      problem.kind === "typo"
        ? messages.emailTypo(problem.suggestion)
        : problem.kind === "disposable"
          ? messages.emailDisposable
          : messages.emailReserved;
    ctx.addIssue({ code: "custom", message });
  });

/** Optional phone; stored formatted ("+7 900 123-45-67") or as E.164 for other countries. */
export const optionalPhoneSchema = z
  .string()
  .max(32, messages.phone)
  .transform((v, ctx) => {
    const value = cleanLine(v);
    if (value === "") return undefined;
    const e164 = normalizePhone(value);
    if (!e164) {
      ctx.addIssue({ code: "custom", message: messages.phone });
      return z.NEVER;
    }
    return formatPhone(e164);
  })
  .optional();

/**
 * Free text from a visitor (booking note, contact message): cleaned, with
 * no links, no markup and no keyboard-mashing.
 */
export function freeTextSchema({ min, max, tooShort, tooLong }: { min: number; max: number; tooShort?: string; tooLong: string }) {
  return z
    .string()
    .transform(cleanText)
    .pipe(
      z
        .string()
        .min(min, tooShort)
        .max(max, tooLong)
        .superRefine((text, ctx) => {
          if (text === "") return;
          if (containsMarkup(text)) ctx.addIssue({ code: "custom", message: messages.noMarkup });
          else if (containsLink(text)) ctx.addIssue({ code: "custom", message: messages.noLinks });
          else if (looksLikeGibberish(text)) ctx.addIssue({ code: "custom", message: messages.gibberish });
        }),
    );
}

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
