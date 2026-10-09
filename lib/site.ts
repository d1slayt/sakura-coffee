/**
 * Site-wide configuration.
 *
 * SakuraCoffee is a concept brand. Everything under `demo` is placeholder
 * information that is clearly labelled in the UI; replace it with real data
 * before using this project for an actual business.
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, matches Date#getDay

export interface OpeningHours {
  /** Key into the dictionary's `hours` labels. */
  id: "weekdays" | "weekend";
  days: Weekday[];
  opens: string; // "HH:mm", shop-local time
  closes: string;
}

export const siteConfig = {
  name: "SakuraCoffee",
  shortDescription: "Небольшой эспрессо-бар с сезонным меню и кофе ручного заваривания.",
  // Explicit URL first; on Vercel fall back to the production domain it provides.
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
  ).replace(/\/$/, ""),
  /** BCP 47 language of the site (html lang, number and date formatting). */
  locale: "ru",
  ogLocale: "ru_RU",
  currency: "RUB",
  /** IANA time zone the shop operates in. Used for opening hours and bookings. */
  timeZone: "Europe/Moscow",
  isDemo: true,
  demo: {
    addressLines: ["ул. Примерная, 1", "Демо-город"],
    email: "hello@sakuracoffee.example",
  },
  hours: [
    { id: "weekdays", days: [1, 2, 3, 4, 5], opens: "07:30", closes: "20:00" },
    { id: "weekend", days: [6, 0], opens: "09:00", closes: "20:00" },
  ] satisfies OpeningHours[],
} as const;

export function hoursForWeekday(day: Weekday): OpeningHours | undefined {
  return siteConfig.hours.find((h) => (h.days as readonly number[]).includes(day));
}

/** Main navigation. Labels come from the dictionary (`nav.items[key]`). */
export const navigation = [
  { href: "/menu", key: "menu", index: "01" },
  { href: "/about", key: "story", index: "02" },
  { href: "/visit", key: "visit", index: "03" },
] as const;
