import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "./site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const priceFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
  maximumFractionDigits: 0,
});

/** Prices are stored in minor units (kopecks); the menu shows whole roubles, e.g. "320 ₽". */
export function formatPrice(minorUnits: number): string {
  return priceFormatter.format(minorUnits / 100);
}

/** "07:30" → "7:30" for display; the config keeps zero-padded HH:mm. */
export function displayTime(time: string): string {
  return time.replace(/^0/, "");
}

/** Absolute URL for metadata, sitemap and JSON-LD. */
export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
