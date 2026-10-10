import { addDays, toZonedIsoDate, weekdayOf } from "@/lib/time";
import { brewBar } from "@/lib/booking";
import { siteConfig } from "@/lib/site";

export const hasDatabase = Boolean(process.env.DATABASE_URL);

/** Email domain used by test data, so cleanup never touches real rows. */
export const TEST_DOMAIN = "integration.example.com";

/** A bookable date `offset` days ahead that isn't a closed weekday. */
export function bookableDate(offset: number): string {
  const today = toZonedIsoDate(new Date(), siteConfig.timeZone);
  let date = addDays(today, offset);
  while ((brewBar.closedWeekdays as readonly number[]).includes(weekdayOf(date))) date = addDays(date, 1);
  return date;
}

export function testEmail(label: string): string {
  return `${label}-${Math.random().toString(36).slice(2, 8)}@${TEST_DOMAIN}`;
}
