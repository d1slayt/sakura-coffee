import { getDictionary } from "./i18n";
import { siteConfig } from "./site";
import { addDays, toZonedIsoDate, weekdayOf, zonedTimeToUtc } from "./time";

/**
 * Brew-bar booking rules. The brew bar is a six-seat pour-over counter that
 * runs 45-minute sessions. These rules are the single source of truth for both
 * the availability API and reservation creation.
 */
export const brewBar = {
  seatsPerSession: 6,
  sessionMinutes: 45,
  minPartySize: 1,
  maxPartySize: 4,
  /** Bookings open from tomorrow (shop-local) … */
  minDaysAhead: 1,
  /** … up to this many days ahead. */
  maxDaysAhead: 30,
  /** Session start times, shop-local. */
  sessionTimes: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
  /** Weekdays without sessions (0 = Sunday). Mondays are for roasting. */
  closedWeekdays: [1],
} as const;

export type SessionTime = (typeof brewBar.sessionTimes)[number];

export function isSessionTime(value: string): value is SessionTime {
  return (brewBar.sessionTimes as readonly string[]).includes(value);
}

export type DateRuleViolation = "TOO_SOON" | "TOO_FAR" | "CLOSED_DAY";

export interface BookingWindow {
  firstDate: string;
  lastDate: string;
}

export function bookingWindow(now: Date, timeZone: string = siteConfig.timeZone): BookingWindow {
  const today = toZonedIsoDate(now, timeZone);
  return {
    firstDate: addDays(today, brewBar.minDaysAhead),
    lastDate: addDays(today, brewBar.maxDaysAhead),
  };
}

/** Returns why a date can't be booked, or null if it can. ISO dates compare lexically. */
export function checkBookingDate(
  date: string,
  now: Date,
  timeZone: string = siteConfig.timeZone,
): DateRuleViolation | null {
  const { firstDate, lastDate } = bookingWindow(now, timeZone);
  if (date < firstDate) return "TOO_SOON";
  if (date > lastDate) return "TOO_FAR";
  if ((brewBar.closedWeekdays as readonly number[]).includes(weekdayOf(date))) return "CLOSED_DAY";
  return null;
}

export function sessionStartUtc(
  date: string,
  time: SessionTime,
  timeZone: string = siteConfig.timeZone,
): Date {
  return zonedTimeToUtc(date, time, timeZone);
}

/** Human-readable explanations, in the site language. */
export const dateRuleMessages: Record<DateRuleViolation, string> = getDictionary().bookingRules;
