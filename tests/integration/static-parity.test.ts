import { describe, expect, it } from "vitest";
import { filterMenu } from "@/lib/menu-filter";
import { staticCategories, staticItems } from "@/lib/static-catalog";
import { parseMenuQuery } from "@/lib/validations/menu";
import { menuQueries } from "@/server/menu";
import { hasDatabase } from "./helpers";

/**
 * The static GitHub Pages demo filters bundled seed data in the browser.
 * These tests keep it honest: for the same query it must return exactly what
 * the SQL version returns from a freshly seeded database.
 */
const queries = [
  {},
  { free: "milk" },
  { free: ["gluten", "nuts"] },
  { diet: "vegan" },
  { diet: "vegetarian", category: "bakery" },
  { q: "КУНЖУТ" },
  { q: "матча", available: "1" },
  { category: "espresso", available: "1" },
];

const slugs = (groups: { items: { slug: string }[] }[]) => groups.flatMap((g) => g.items.map((i) => i.slug));

describe("static catalog", () => {
  it("mirrors the seed data", () => {
    expect(staticItems).toHaveLength(23);
    expect(staticCategories.map((c) => c.slug)).toEqual(["espresso", "filter", "tea", "cold", "bakery", "kitchen"]);
    expect(staticItems.find((i) => i.slug === "butter-croissant")?.allergens).toEqual(["GLUTEN", "MILK", "EGGS"]);
  });
});

describe.skipIf(!hasDatabase)("static demo ↔ PostgreSQL parity", () => {
  it.each(queries)("returns the same items for %j", async (raw) => {
    const query = parseMenuQuery(raw);
    const fromDb = await menuQueries.search(query);
    const fromStatic = filterMenu(staticItems, staticCategories, query);
    expect(slugs(fromStatic)).toEqual(slugs(fromDb));
    // Same derived data, not just the same slugs.
    // Ids differ by design (cuid vs slug), so they are blanked before comparing.
    const comparable = (groups: typeof fromDb) => groups.flatMap((g) => g.items).map((item) => ({ ...item, id: "" }));
    expect(comparable(fromStatic)).toEqual(comparable(fromDb));
  });
});
