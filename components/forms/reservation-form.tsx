"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { brewBar, bookingWindow, checkBookingDate, dateRuleMessages, type SessionTime } from "@/lib/booking";
import { isStaticDemo } from "@/lib/static-demo";
import { idleState, type FormState } from "@/lib/form-state";
import { cn } from "@/lib/utils";
import { submitReservation, type ReservationField } from "@/server/actions";
import { ActionButton } from "@/components/ui/action";
import { BotFields } from "./bot-fields";
import { describedBy, Field, inputClass } from "./field";
import { FormError, FormSuccess } from "./form-status";
import { submitWithoutReset } from "./submit";

export interface ReservationLabels {
  date: string;
  time: string;
  timeHint: string;
  seatsFull: string;
  seatsOne: string;
  seatsMany: string;
  sessionLength: string;
  partySize: string;
  name: string;
  email: string;
  phone: string;
  note: string;
  submit: string;
  submitting: string;
  successTitle: string;
  reference: string;
  demoSuccess: string;
  another: string;
  loadingSlots: string;
  slotsError: string;
}

type Slot = { time: SessionTime; seatsLeft: number; available: boolean };

type Availability =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error" }
  | { state: "closed"; message: string }
  | { state: "ready"; slots: Slot[] };

interface AvailabilityResponse {
  data?: { bookable: boolean; slots: Slot[]; message?: string };
}

// The booking window depends on "today", which only the browser should decide
// (the server render has no date). useSyncExternalStore gives `null` during
// SSR/hydration and the real window afterwards, without effects.
let cachedWindow: { day: string; value: ReturnType<typeof bookingWindow> } | null = null;
const noSubscribe = () => () => {};
function readBookingWindow() {
  const day = new Date().toDateString();
  if (cachedWindow?.day !== day) cachedWindow = { day, value: bookingWindow(new Date()) };
  return cachedWindow.value;
}
function useBookingWindow() {
  return useSyncExternalStore(noSubscribe, readBookingWindow, () => null);
}

/** Remounting the inner form (new key) is how "make another booking" resets the action state. */
export function ReservationForm({ labels }: { labels: ReservationLabels }) {
  const [instance, setInstance] = useState(0);
  return <ReservationFormInner key={instance} labels={labels} onReset={() => setInstance((n) => n + 1)} />;
}

function ReservationFormInner({ labels, onReset }: { labels: ReservationLabels; onReset: () => void }) {
  const [state, formAction, pending] = useActionState<FormState<ReservationField>, FormData>(
    submitReservation,
    idleState,
  );

  if (state.status === "success") {
    return (
      <FormSuccess
        title={labels.successTitle}
        action={
          <ActionButton variant="outline" onClick={onReset}>
            {labels.another}
          </ActionButton>
        }
      >
        <p>{state.message}</p>
        {state.reference ? (
          <p>
            <span className="meta mr-3 text-muted">{labels.reference}</span>
            <span className="font-semibold tracking-wider tabular">{state.reference}</span>
          </p>
        ) : null}
        {/* In the static demo the action's own message already explains that nothing was stored. */}
        {isStaticDemo ? null : <p className="text-sm text-muted">{labels.demoSuccess}</p>}
      </FormSuccess>
    );
  }

  return <ReservationFields labels={labels} state={state} formAction={formAction} pending={pending} />;
}

function ReservationFields({
  labels,
  state,
  formAction,
  pending,
}: {
  labels: ReservationLabels;
  state: FormState<ReservationField>;
  formAction: (formData: FormData) => void;
  pending: boolean;
}) {
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? (state.values ?? {}) : {};

  const [date, setDate] = useState(values.date ?? "");
  const [time, setTime] = useState(values.time ?? "");
  const [partySize, setPartySize] = useState(values.partySize ?? "2");
  const [availability, setAvailability] = useState<Availability>({ state: "idle" });
  const window_ = useBookingWindow();
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  // Fetched from the change handler rather than an effect: one request per
  // user action, and stale responses are aborted.
  const loadAvailability = (nextDate: string) => {
    request.current?.abort();
    if (!nextDate) {
      setAvailability({ state: "idle" });
      return;
    }
    if (isStaticDemo) {
      // No server in the static demo: apply the same calendar rules locally and show every seat as free.
      const violation = checkBookingDate(nextDate, new Date());
      setAvailability(
        violation
          ? { state: "closed", message: dateRuleMessages[violation] }
          : {
              state: "ready",
              slots: brewBar.sessionTimes.map((time) => ({ time, seatsLeft: brewBar.seatsPerSession, available: true })),
            },
      );
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setAvailability({ state: "loading" });
    fetch(`/api/reservations/availability?date=${encodeURIComponent(nextDate)}`, { signal: controller.signal })
      .then(async (res) => {
        const body = (await res.json()) as AvailabilityResponse;
        if (!res.ok || !body.data) throw new Error(String(res.status));
        setAvailability(
          body.data.bookable
            ? { state: "ready", slots: body.data.slots }
            : { state: "closed", message: body.data.message ?? "" },
        );
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name !== "AbortError") setAvailability({ state: "error" });
      });
  };

  const seatsLabel = (n: number) =>
    n === 0 ? labels.seatsFull : n === 1 ? labels.seatsOne : labels.seatsMany.replace("{n}", String(n));

  const slots: Slot[] =
    availability.state === "ready"
      ? availability.slots
      : brewBar.sessionTimes.map((t) => ({ time: t, seatsLeft: brewBar.seatsPerSession, available: true }));
  const slotsKnown = availability.state === "ready";
  const slotsDisabled = !date || availability.state === "closed" || availability.state === "loading";
  const selectedSlot = slots.find((s) => s.time === time);
  const maxGuests = Math.min(brewBar.maxPartySize, slotsKnown && selectedSlot ? Math.max(1, selectedSlot.seatsLeft) : brewBar.maxPartySize);

  const timeHint =
    availability.state === "loading"
      ? labels.loadingSlots
      : availability.state === "error"
        ? labels.slotsError
        : availability.state === "closed"
          ? availability.message
          : !date
            ? labels.timeHint
            : undefined;

  return (
    <form
      action={formAction}
      onSubmit={(e) => submitWithoutReset(e, formAction)}
      noValidate
      className="relative space-y-8"
      aria-describedby={state.status === "error" ? "reservation-error" : undefined}
    >
      <BotFields id="res" />
      {state.status === "error" ? (
        <div id="reservation-error">
          <FormError message={state.message} />
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="res-date" label={labels.date} error={errors.date}>
          <input
            id="res-date"
            name="date"
            type="date"
            required
            value={date}
            min={window_?.firstDate}
            max={window_?.lastDate}
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
              loadAvailability(e.target.value);
            }}
            aria-invalid={errors.date ? true : undefined}
            aria-describedby={describedBy("res-date", errors.date)}
            className={inputClass}
          />
        </Field>

        <Field id="res-party" label={labels.partySize} error={errors.partySize}>
          <select
            id="res-party"
            name="partySize"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            aria-invalid={errors.partySize ? true : undefined}
            aria-describedby={describedBy("res-party", errors.partySize)}
            className={cn(inputClass, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M4 6l4 4 4-4%22 fill=%22none%22 stroke=%22%23241c19%22 stroke-width=%221.5%22/></svg>')] bg-[length:16px] bg-[right_0.875rem_center] bg-no-repeat pr-10")}
          >
            {Array.from({ length: brewBar.maxPartySize }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n} disabled={n > maxGuests}>
                {n}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset aria-describedby={errors.time ? "res-time-error" : timeHint ? "res-time-hint" : undefined} aria-invalid={errors.time ? true : undefined}>
        <legend className="meta mb-2 text-ink">{labels.time}</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {slots.map((slot) => {
            const disabled = slotsDisabled || (slotsKnown && (!slot.available || slot.seatsLeft < Number(partySize)));
            return (
              <label
                key={slot.time}
                className={cn(
                  "flex min-h-14 cursor-pointer flex-col justify-center border px-3 py-2 transition-colors duration-(--duration-quick) has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-alert",
                  time === slot.time ? "border-ink bg-ink text-paper" : "border-line-strong hover:border-ink",
                  disabled && "cursor-not-allowed opacity-45 hover:border-line-strong",
                )}
              >
                <input
                  type="radio"
                  name="time"
                  value={slot.time}
                  checked={time === slot.time}
                  disabled={disabled}
                  onChange={() => setTime(slot.time)}
                  className="sr-only"
                />
                <span className="text-lg font-semibold tabular">{slot.time}</span>
                <span className={cn("text-xs", time === slot.time ? "text-pine-soft" : "text-muted")}>
                  {slotsKnown ? seatsLabel(slot.seatsLeft) : labels.sessionLength.replace("{n}", String(brewBar.sessionMinutes))}
                </span>
              </label>
            );
          })}
        </div>
        {errors.time ? (
          <p id="res-time-error" className="mt-2 text-sm font-medium text-alert">
            {errors.time}
          </p>
        ) : timeHint ? (
          <p id="res-time-hint" className="mt-2 text-sm text-muted" aria-live="polite">
            {timeHint}
          </p>
        ) : null}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="res-name" label={labels.name} error={errors.name}>
          <input
            id="res-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={80}
            defaultValue={values.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("res-name", errors.name)}
            className={inputClass}
          />
        </Field>
        <Field id="res-email" label={labels.email} error={errors.email}>
          <input
            id="res-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            defaultValue={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("res-email", errors.email)}
            className={inputClass}
          />
        </Field>
        <Field id="res-phone" label={labels.phone} error={errors.phone}>
          <input
            id="res-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={32}
            defaultValue={values.phone}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy("res-phone", errors.phone)}
            className={inputClass}
          />
        </Field>
        <Field id="res-note" label={labels.note} error={errors.note} className="sm:col-span-2">
          <textarea
            id="res-note"
            name="note"
            rows={3}
            maxLength={500}
            defaultValue={values.note}
            aria-invalid={errors.note ? true : undefined}
            aria-describedby={describedBy("res-note", errors.note)}
            className={cn(inputClass, "resize-y")}
          />
        </Field>
      </div>

      <ActionButton type="submit" disabled={pending} arrow aria-disabled={pending}>
        {pending ? labels.submitting : labels.submit}
      </ActionButton>
    </form>
  );
}
