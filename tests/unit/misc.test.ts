import { describe, expect, it } from "vitest";
import { plural } from "@/lib/i18n/dictionaries/ru";
import { getDictionary } from "@/lib/i18n";
import en from "@/lib/i18n/dictionaries/en";
import { menuHref, toggle } from "@/lib/menu-url";
import { openStateAt } from "@/lib/opening";
import { formatPrice } from "@/lib/utils";
import { buildMenuWhere } from "@/server/menu";
import { looksAutomated, MIN_FILL_MS } from "@/server/form-guard";
import { clientIpFrom, hashIdentifier } from "@/server/rate-limit";

describe("russian plural", () => {
  it.each([
    [1, "позиция"],
    [2, "позиции"],
    [5, "позиций"],
    [11, "позиций"],
    [21, "позиция"],
    [23, "позиции"],
  ])("%i → %s", (n, word) => {
    expect(plural(n, "позиция", "позиции", "позиций")).toBe(word);
  });
});

describe("dictionaries", () => {
  it("defaults to Russian and keeps English complete", () => {
    expect(getDictionary().nav.items.menu).toBe("Меню");
    expect(getDictionary("en").nav.items.menu).toBe(en.nav.items.menu);
  });
});

describe("formatPrice", () => {
  it("formats kopecks as whole roubles", () => {
    expect(formatPrice(29000).replace(/\s/g, " ")).toBe("290 ₽");
  });
});

describe("openStateAt (Moscow)", () => {
  it("is open on a weekday morning", () => {
    expect(openStateAt(new Date("2026-10-13T06:00:00Z"))).toEqual({ open: true, closes: "20:00" }); // Tue 09:00
  });
  it("points to tomorrow after closing", () => {
    expect(openStateAt(new Date("2026-10-09T18:30:00Z"))).toEqual({
      open: false,
      opensNext: { label: "tomorrow", time: "09:00" }, // Fri 21:30 → Sat opens 09:00
    });
  });
  it("points to later today before opening", () => {
    expect(openStateAt(new Date("2026-10-13T03:00:00Z"))).toEqual({
      open: false,
      opensNext: { label: "today", time: "07:30" },
    });
  });
});

describe("menu URLs", () => {
  it("serialises filters stably", () => {
    expect(menuHref({ q: "чай", diet: ["vegan"], free: ["milk", "nuts"], available: true })).toBe(
      "/menu?q=%D1%87%D0%B0%D0%B9&diet=vegan&free=milk&free=nuts&available=1",
    );
    expect(menuHref({})).toBe("/menu");
    expect(toggle(["a", "b"], "a")).toEqual(["b"]);
  });
});

describe("buildMenuWhere", () => {
  it("derives 'free from' filters from ingredient allergens", () => {
    expect(buildMenuWhere({ q: undefined, category: undefined, diet: [], free: ["milk"], available: false })).toEqual({
      AND: [{ ingredients: { none: { ingredient: { allergens: { has: "MILK" } } } } }],
    });
  });
  it("returns an empty filter for an empty query", () => {
    expect(buildMenuWhere({ q: undefined, category: undefined, diet: [], free: [], available: false })).toEqual({});
  });
});

describe("form guard", () => {
  const form = (entries: Record<string, string>) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(entries)) fd.set(k, v);
    return fd;
  };
  const now = 1_800_000_000_000;

  it("flags a filled honeypot", () => {
    expect(looksAutomated(form({ website: "spam.example", startedAt: String(now - 10_000) }), now)).toBe(true);
  });
  it("flags submissions faster than a human", () => {
    expect(looksAutomated(form({ website: "", startedAt: String(now - MIN_FILL_MS + 100) }), now)).toBe(true);
  });
  it("allows normal submissions and no-JS submissions", () => {
    expect(looksAutomated(form({ website: "", startedAt: String(now - 15_000) }), now)).toBe(false);
    expect(looksAutomated(form({ website: "", startedAt: "" }), now)).toBe(false);
  });
});

describe("rate-limit identifiers", () => {
  it("uses the first forwarded address and never exposes it", () => {
    expect(clientIpFrom(new Headers({ "x-forwarded-for": "198.51.100.7, 10.0.0.1" }))).toBe("198.51.100.7");
    const hashed = hashIdentifier("198.51.100.7");
    expect(hashed).toMatch(/^[0-9a-f]{32}$/);
    expect(hashed).not.toContain("198");
  });
});
