"use server";

import { dateRuleMessages } from "@/lib/booking";
import { isDatabaseUnavailable, logServerError } from "@/lib/db/errors";
import type { FormState } from "@/lib/form-state";
import { getDictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { firstFieldErrors } from "@/lib/validations/common";
import { contactInputSchema } from "@/lib/validations/contact";
import { reservationInputSchema } from "@/lib/validations/reservation";
import { createContactMessage } from "./contact";
import { looksAutomated } from "./form-guard";
import { consumeRateLimitForRequest } from "./rate-limit";
import { createReservation } from "./reservations";

const reservationFields = ["name", "email", "phone", "date", "time", "partySize", "note"] as const;
const contactFields = ["name", "email", "topic", "message"] as const;

export type ReservationField = (typeof reservationFields)[number];
export type ContactField = (typeof contactFields)[number];

function pick<T extends string>(formData: FormData, fields: readonly T[]): Record<T, string> {
  const out = {} as Record<T, string>;
  for (const field of fields) {
    const value = formData.get(field);
    out[field] = typeof value === "string" ? value : "";
  }
  return out;
}

export async function submitReservation(
  _prev: FormState<ReservationField>,
  formData: FormData,
): Promise<FormState<ReservationField>> {
  const m = getDictionary().forms;
  const values = pick(formData, reservationFields);

  if (looksAutomated(formData)) {
    // Respond like a success so bots learn nothing, but store nothing.
    return { status: "success", message: m.botReservation };
  }

  const parsed = reservationInputSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: m.checkFields, fieldErrors: firstFieldErrors(parsed.error), values };
  }
  const { partySize, time, date } = parsed.data;

  try {
    const limit = await consumeRateLimitForRequest("reservation");
    if (!limit.allowed) return { status: "error", message: m.tooMany, values };

    const result = await createReservation(parsed.data);
    if (result.ok) {
      return { status: "success", reference: result.reference, message: m.reservationReceived(partySize, time, date) };
    }

    switch (result.error) {
      case "TOO_SOON":
      case "TOO_FAR":
      case "CLOSED_DAY":
        return {
          status: "error",
          message: dateRuleMessages[result.error],
          fieldErrors: { date: dateRuleMessages[result.error] },
          values,
        };
      case "NOT_ENOUGH_SEATS":
        return {
          status: "error",
          message: result.seatsLeft ? m.seatsLeftAt(result.seatsLeft, time) : m.sessionFull(time),
          fieldErrors: { time: m.notEnoughSeats },
          values,
        };
      case "DUPLICATE":
        return { status: "error", message: m.duplicate, values };
      case "BUSY":
        return { status: "error", message: m.busy, values };
    }
  } catch (error) {
    logServerError("submitReservation", error);
    return { status: "error", message: isDatabaseUnavailable(error) ? m.bookingUnavailable : m.unexpected, values };
  }
}

export async function submitContact(
  _prev: FormState<ContactField>,
  formData: FormData,
): Promise<FormState<ContactField>> {
  const m = getDictionary().forms;
  const values = pick(formData, contactFields);

  if (looksAutomated(formData)) {
    return { status: "success", message: m.botContact };
  }

  const parsed = contactInputSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: m.checkFields, fieldErrors: firstFieldErrors(parsed.error), values };
  }

  try {
    const limit = await consumeRateLimitForRequest("contact");
    if (!limit.allowed) return { status: "error", message: m.tooMany, values };

    await createContactMessage(parsed.data);
    return { status: "success", message: siteConfig.isDemo ? m.contactSavedDemo : m.contactSaved };
  } catch (error) {
    logServerError("submitContact", error);
    return { status: "error", message: isDatabaseUnavailable(error) ? m.contactUnavailable : m.unexpected, values };
  }
}
