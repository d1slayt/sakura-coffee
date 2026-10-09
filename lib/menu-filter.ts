import type { MenuCategoryView, MenuGroup, MenuItemView } from "./menu-types";
import type { MenuQuery } from "./validations/menu";

const FREE_FROM = { gluten: "GLUTEN", milk: "MILK", nuts: "NUTS" } as const;

/**
 * In-memory equivalent of `buildMenuWhere` (server/menu-where.ts), used by the
 * static GitHub Pages build where there is no database. Same semantics:
 * text search over name, description and ingredients; category; dietary
 * tags; "free from" derived from ingredient allergens; availability.
 */
export function matchesMenuQuery(item: MenuItemView, query: MenuQuery): boolean {
  if (query.q) {
    const needle = query.q.toLocaleLowerCase("ru");
    const haystack = [item.name, item.description, ...item.ingredients].map((s) => s.toLocaleLowerCase("ru"));
    if (!haystack.some((s) => s.includes(needle))) return false;
  }
  if (query.category && item.category.slug !== query.category) return false;
  if (query.available && !item.isAvailable) return false;
  for (const diet of query.diet) {
    const accepted = diet === "vegan" ? ["VEGAN"] : ["VEGAN", "VEGETARIAN", "VEGAN_OPTION"];
    if (!item.dietaryTags.some((t) => accepted.includes(t))) return false;
  }
  for (const free of query.free) {
    if (item.allergens.includes(FREE_FROM[free])) return false;
  }
  return true;
}

/** Filters and groups items by category, keeping menu order. */
export function filterMenu(items: MenuItemView[], categories: MenuCategoryView[], query: MenuQuery): MenuGroup[] {
  return categories
    .map(({ id, name, slug, section, description }) => ({
      category: { id, name, slug, section, description },
      items: items.filter((item) => item.category.slug === slug && matchesMenuQuery(item, query)),
    }))
    .filter((group) => group.items.length > 0);
}
