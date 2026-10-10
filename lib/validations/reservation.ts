import { z } from "zod";
import { brewBar, isSessionTime, type SessionTime } from "@/lib/booking";
import { emailSchema, freeTextSchema, isoDateSchema, messages, nameSchema, optionalPhoneSchema } from "./common";

/**
 * Shape validation for a reservation request. Calendar rules that depend on
 * the current time (booking window, closed days) are applied by the service
 * with an explicit `now`, see `checkBookingDate`.
 *
 * There is deliberately no `status` field: every request is stored as PENDING.
 */
export const reservationInputSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: optionalPhoneSchema,
  date: isoDateSchema,
  time: z
    .string()
    .trim()
    .refine(isSessionTime, messages.time)
    .transform((v) => v as SessionTime),
  partySize: z.coerce
    .number({ error: messages.partySize })
    .int(messages.partySize)
    .min(brewBar.minPartySize, messages.partyMin)
    .max(brewBar.maxPartySize, messages.partyMax),
  note: freeTextSchema({ min: 0, max: 500, tooLong: messages.noteTooLong })
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
});

export type ReservationInput = z.infer<typeof reservationInputSchema>;

export const availabilityQuerySchema = z.object({
  date: isoDateSchema,
});
