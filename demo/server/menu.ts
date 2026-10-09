// STATIC DEMO OVERRIDE — copied over server/menu.ts by scripts/prepare-pages.mjs.
// Same exports as the database-backed module, served from bundled seed data.
import { filterMenu } from "@/lib/menu-filter";
import type { MenuCategoryView, MenuGroup, MenuItemView } from "@/lib/menu-types";
import { staticCategories, staticItems } from "@/lib/static-catalog";
import type { MenuQuery } from "@/lib/validations/menu";

export type { MenuCategoryView, MenuGroup, MenuItemView } from "@/lib/menu-types";

/** Nothing to defer: the static build renders everything ahead of time. */
export async function deferToRequest(): Promise<void> {}

export const menuQueries = {
  categories: async (): Promise<MenuCategoryView[]> => staticCategories,
  search: async (query: MenuQuery): Promise<MenuGroup[]> => filterMenu(staticItems, staticCategories, query),
  bySlug: async (slug: string): Promise<MenuItemView | null> => staticItems.find((i) => i.slug === slug) ?? null,
  featured: async (): Promise<MenuItemView[]> => staticItems.filter((i) => i.isFeatured).slice(0, 6),
  slugs: async () => staticItems.map((i) => ({ slug: i.slug, updatedAt: new Date("2026-10-09T00:00:00Z") })),
};

export const getMenuCategories = menuQueries.categories;
export const searchMenu = menuQueries.search;
export const getMenuItemBySlug = menuQueries.bySlug;
export const getFeaturedMenuItems = menuQueries.featured;
export const getMenuItemSlugs = menuQueries.slugs;
