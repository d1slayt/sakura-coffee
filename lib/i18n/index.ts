import en, { type Dictionary } from "./dictionaries/en";
import ru from "./dictionaries/ru";

export type { Dictionary } from "./dictionaries/en";

export const locales = ["ru", "en"] as const;
export type Locale = (typeof locales)[number];

/** Russian is the site's primary language; English is kept as a complete second dictionary. */
export const defaultLocale: Locale = "ru";

/**
 * To serve both languages at once, move pages under an `app/[lang]` segment
 * and pass the locale here. Components don't need to change: they only read
 * from the dictionary. Menu content in the database is stored in one language
 * (Russian); a second language for it would need translation columns/tables.
 */
const dictionaries: Record<Locale, Dictionary> = { ru, en };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}
