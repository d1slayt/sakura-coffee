import { hoursForWeekday, siteConfig, type Weekday } from "./site";
import { minutesOf, zonedParts } from "./time";

export type OpenState =
  | { open: true; closes: string }
  | { open: false; opensNext: { label: "today" | "tomorrow"; time: string } | null };

/** Whether the shop is open at `now`, in the shop's time zone. Pure; used by the header badge. */
export function openStateAt(now: Date, timeZone: string = siteConfig.timeZone): OpenState {
  const p = zonedParts(now, timeZone);
  const minutes = p.hour * 60 + p.minute;
  const today = hoursForWeekday(p.weekday as Weekday);

  if (today && minutes >= minutesOf(today.opens) && minutes < minutesOf(today.closes)) {
    return { open: true, closes: today.closes };
  }
  if (today && minutes < minutesOf(today.opens)) {
    return { open: false, opensNext: { label: "today", time: today.opens } };
  }
  const tomorrow = hoursForWeekday(((p.weekday + 1) % 7) as Weekday);
  return { open: false, opensNext: tomorrow ? { label: "tomorrow", time: tomorrow.opens } : null };
}
