/** Minimum time a human needs to fill in a form; faster submissions are bots. */
export const MIN_FILL_MS = 2_500;
const MAX_FORM_AGE_MS = 1000 * 60 * 60 * 12;

/**
 * Lightweight bot checks for public forms, applied before any database work:
 * - `website` is a honeypot field hidden from people and assistive tech;
 * - `startedAt` is written by the browser when the page becomes interactive;
 *   submissions faster than MIN_FILL_MS are rejected. Without JavaScript the
 *   field is empty, so the timing check is skipped to keep the form usable.
 * Both checks are spoofable by a targeted attacker, which is why every public
 * action is also rate-limited (server/rate-limit.ts).
 */
export function looksAutomated(formData: FormData, now: number = Date.now()): boolean {
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;

  const raw = formData.get("startedAt");
  if (typeof raw !== "string" || raw === "") return false;
  const startedAt = Number(raw);
  if (!Number.isFinite(startedAt)) return true;
  const elapsed = now - startedAt;
  return elapsed < MIN_FILL_MS || elapsed > MAX_FORM_AGE_MS;
}
