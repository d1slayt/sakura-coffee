// STATIC DEMO OVERRIDE — copied over server/actions.ts by scripts/prepare-pages.mjs.
// GitHub Pages has no server, so these run in the browser: the same Zod
// schemas and booking rules validate input, but nothing is sent or stored.
import { checkBookingDate, dateRuleMessages } from "@/lib/booking";
import type { FormState } from "@/lib/form-state";
import { getDictionary } from "@/lib/i18n";
import { firstFieldErrors } from "@/lib/validations/common";
import { contactInputSchema } from "@/lib/validations/contact";
import { reservationInputSchema } from "@/lib/validations/reservation";

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
  const t = getDictionary();
  const values = pick(formData, reservationFields);
  const parsed = reservationInputSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: t.forms.checkFields, fieldErrors: firstFieldErrors(parsed.error), values };
  }
  const violation = checkBookingDate(parsed.data.date, new Date());
  if (violation) {
    return { status: "error", message: dateRuleMessages[violation], fieldErrors: { date: dateRuleMessages[violation] }, values };
  }
  const { partySize, time, date } = parsed.data;
  return {
    status: "success",
    message: `${t.forms.reservationReceived(partySize, time, date)} ${t.staticDemo.reservation}`,
  };
}

export async function submitContact(
  _prev: FormState<ContactField>,
  formData: FormData,
): Promise<FormState<ContactField>> {
  const t = getDictionary();
  const values = pick(formData, contactFields);
  const parsed = contactInputSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: t.forms.checkFields, fieldErrors: firstFieldErrors(parsed.error), values };
  }
  return { status: "success", message: t.staticDemo.contact };
}
