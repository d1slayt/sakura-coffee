/**
 * Text hygiene for public forms: normalisation and spam heuristics shared by
 * the reservation and contact schemas. Everything here is pure, so the static
 * demo runs exactly the same checks in the browser.
 */

/** Zero-width characters, bidi overrides and other invisible format characters. */
const INVISIBLE = /[­᠎​-‏‪-‮⁠-⁤⁦-⁯﻿]/g;
/** Control characters except tab and line breaks. */
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** NFKC-normalises, removes invisible/control characters and collapses spaces to one line. */
export function cleanLine(value: string): string {
  return value.normalize("NFKC").replace(INVISIBLE, "").replace(CONTROL, "").replace(/\s+/g, " ").trim();
}

/** Same as cleanLine, but keeps paragraphs: at most one blank line in a row. */
export function cleanText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(INVISIBLE, "")
    .replace(CONTROL, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Links and things that work as links: URLs, "www.", bare domains with a
 * common TLD, Telegram/WhatsApp handles. Spam in small-business forms is
 * almost always an attempt to get a link in front of someone.
 */
const LINK =
  // `\b` is ASCII-only in JavaScript, so word edges are spelled out to cover Cyrillic domains (.рф).
  /(?:https?:\/\/|www\.|t\.me\/|wa\.me\/|(?<![\p{L}\d-])[\p{L}\d-]+\.(?:ru|рф|su|com|net|org|info|biz|io|me|co|xyz|top|site|online|store|shop|click|link|pro|club|live|app|ly|cc|tk|ua|by|kz)(?![\p{L}\d]))/iu;

export function containsLink(value: string): boolean {
  return LINK.test(value);
}

/** HTML tags or character entities. */
export function containsMarkup(value: string): boolean {
  return /<\/?[a-z!][^>]*>|&(?:#\d+|#x[\da-f]+|[a-z]+);/i.test(value);
}

/** Text that isn't written by a person: long runs of one character, shouting, no letters at all. */
export function looksLikeGibberish(value: string): boolean {
  if (/(.)\1{5,}/u.test(value.replace(/\s/g, ""))) return true;
  const letters = value.match(/\p{L}/gu) ?? [];
  if (letters.length < 3) return true;
  const upper = letters.filter((c) => c !== c.toLowerCase()).length;
  return letters.length >= 12 && upper / letters.length > 0.7;
}

/** A person's name: letters, spaces, hyphens, apostrophes and dots; 1–4 words; no digits or links. */
export function isPlausibleName(value: string): boolean {
  if (!/^\p{L}[\p{L}\p{M}' .-]*$/u.test(value) || containsLink(value)) return false;
  if (value.split(" ").length > 4) return false;
  if (/(.)\1{3,}/u.test(value)) return false;
  return (value.match(/\p{L}/gu) ?? []).length >= 2;
}

// ─── Email ──────────────────────────────────────────────────────────────────

/** Top-level domains reserved for documentation and testing (RFC 2606/6761): never real mailboxes. */
const RESERVED_TLDS = ["test", "example", "invalid", "localhost", "local"];

/** Well-known throwaway inbox providers. */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "yopmail.com",
  "guerrillamail.com",
  "sharklasers.com",
  "10minutemail.com",
  "temp-mail.org",
  "tempmail.com",
  "tempail.com",
  "throwawaymail.com",
  "trashmail.com",
  "getnada.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "mohmal.com",
  "emailondeck.com",
  "minuteinbox.com",
  "dropmail.me",
  "mail.tm",
  "tempmailo.com",
]);

/** Common misspellings of popular mail domains, with the likely intended domain. */
const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.ru": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "yandex.ry": "yandex.ru",
  "yandx.ru": "yandex.ru",
  "yadex.ru": "yandex.ru",
  "mail.ri": "mail.ru",
  "mail.ry": "mail.ru",
  "maill.ru": "mail.ru",
  "mial.ru": "mail.ru",
  "inbox.ry": "inbox.ru",
  "rambler.ry": "rambler.ru",
  "icloud.co": "icloud.com",
  "outlok.com": "outlook.com",
  "hotmial.com": "hotmail.com",
};

export type EmailProblem = { kind: "reserved" } | { kind: "disposable" } | { kind: "typo"; suggestion: string };

/** Checks the domain of an already well-formed, lower-cased email address. */
export function emailDomainProblem(email: string): EmailProblem | null {
  const domain = email.slice(email.lastIndexOf("@") + 1);
  const tld = domain.slice(domain.lastIndexOf(".") + 1);
  if (RESERVED_TLDS.includes(tld)) return { kind: "reserved" };
  if (DISPOSABLE_DOMAINS.has(domain)) return { kind: "disposable" };
  const suggestion = DOMAIN_TYPOS[domain];
  return suggestion ? { kind: "typo", suggestion: `${email.slice(0, email.lastIndexOf("@"))}@${suggestion}` } : null;
}

// ─── Phone ──────────────────────────────────────────────────────────────────

/**
 * Normalises a phone number to E.164 ("+79001234567"), or returns null.
 * Accepts Russian numbers written as +7…, 8… or 7… (11 digits, area code
 * starting with 3, 4, 8 or 9) and international numbers with a leading "+"
 * (8–15 digits). Spaces, dashes, dots and brackets are allowed as separators.
 * Obvious fakes (one repeated digit, 1234567…) are rejected.
 */
export function normalizePhone(value: string): string | null {
  const raw = value.trim();
  if (!/^\+?[\d\s().-]+$/.test(raw)) return null;
  const digits = raw.replace(/\D/g, "");
  let e164: string;
  if (/^[78]\d{10}$/.test(digits) && !(raw.startsWith("+") && digits.startsWith("8"))) {
    if (!/^[3489]/.test(digits.slice(1))) return null;
    e164 = `+7${digits.slice(1)}`;
  } else if (raw.startsWith("+") && /^[1-9]\d{7,14}$/.test(digits)) {
    e164 = `+${digits}`;
  } else {
    return null;
  }
  const subscriber = e164.slice(-7);
  if (/^(\d)\1+$/.test(subscriber) || "0123456789".includes(subscriber) || "9876543210".includes(subscriber)) return null;
  return e164;
}

/** "+79001234567" → "+7 900 123-45-67"; other countries are kept as E.164. */
export function formatPhone(e164: string): string {
  const m = /^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(e164);
  return m ? `+7 ${m[1]} ${m[2]}-${m[3]}-${m[4]}` : e164;
}
