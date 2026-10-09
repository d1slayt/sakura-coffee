import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "@/lib/db/client";
import type { Allergen, DietaryTag, MenuSection, Prisma } from "@/lib/generated/prisma/client";
import type { MenuQuery } from "@/lib/validations/menu";

/** Public, serializable view of a menu item: the API contract for UI and REST. */
export interface MenuItemView {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  isAvailable: boolean;
  availabilityNote: string | null;
  isFeatured: boolean;
  imageUrl: string | null;
  imageAlt: string | null;
  brewNote: string | null;
  dietaryTags: DietaryTag[];
  ingredients: string[];
  allergens: Allergen[];
  category: { name: string; slug: string; section: MenuSection };
}

export interface MenuCategoryView {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  section: MenuSection;
  itemCount: number;
}

export interface MenuGroup {
  category: Omit<MenuCategoryView, "itemCount">;
  items: MenuItemView[];
}

const itemInclude = {
  category: { select: { name: true, slug: true, section: true } },
  ingredients: {
    orderBy: { position: "asc" },
    select: { ingredient: { select: { name: true, allergens: true } } },
  },
} satisfies Prisma.MenuItemInclude;

type ItemRow = Prisma.MenuItemGetPayload<{ include: typeof itemInclude }>;

const ALLERGEN_ORDER: Allergen[] = ["GLUTEN", "MILK", "EGGS", "NUTS", "PEANUTS", "SOY", "SESAME", "SULPHITES"];

function toView(row: ItemRow): MenuItemView {
  const allergenSet = new Set(row.ingredients.flatMap((i) => i.ingredient.allergens));
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    priceCents: row.priceCents,
    isAvailable: row.isAvailable,
    availabilityNote: row.availabilityNote,
    isFeatured: row.isFeatured,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt,
    brewNote: row.brewNote,
    dietaryTags: row.dietaryTags,
    ingredients: row.ingredients.map((i) => i.ingredient.name),
    allergens: ALLERGEN_ORDER.filter((a) => allergenSet.has(a)),
    category: { name: row.category.name, slug: row.category.slug, section: row.category.section },
  };
}

const FREE_FROM_ALLERGEN = { gluten: "GLUTEN", milk: "MILK", nuts: "NUTS" } as const satisfies Record<
  MenuQuery["free"][number],
  Allergen
>;

/** Builds the Prisma filter for a menu query. Exported for unit tests. */
export function buildMenuWhere(query: MenuQuery): Prisma.MenuItemWhereInput {
  const and: Prisma.MenuItemWhereInput[] = [];

  if (query.q) {
    const contains = { contains: query.q, mode: "insensitive" } as const;
    and.push({
      OR: [
        { name: contains },
        { description: contains },
        { ingredients: { some: { ingredient: { name: contains } } } },
      ],
    });
  }
  if (query.category) and.push({ category: { slug: query.category } });
  if (query.available) and.push({ isAvailable: true });

  for (const diet of query.diet) {
    // A vegan item is also vegetarian; "vegan option" items qualify as vegetarian
    // because the default build is dairy-based but meat-free.
    and.push({
      dietaryTags: {
        hasSome: diet === "vegan" ? ["VEGAN"] : ["VEGAN", "VEGETARIAN", "VEGAN_OPTION"],
      },
    });
  }
  for (const free of query.free) {
    and.push({
      ingredients: { none: { ingredient: { allergens: { has: FREE_FROM_ALLERGEN[free] } } } },
    });
  }

  return and.length > 0 ? { AND: and } : {};
}

// ─── Queries ────────────────────────────────────────────────────────────────
// Plain, uncached data access. The REST API calls these directly (and relies on
// HTTP caching headers), so database errors keep their codes and map to 503.

export const menuQueries = {
  async categories(): Promise<MenuCategoryView[]> {
    const rows = await getDb().menuCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { items: true } } },
    });
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      section: row.section,
      itemCount: row._count.items,
    }));
  },

  /** Items matching `query`, grouped by category in menu order. */
  async search(query: MenuQuery): Promise<MenuGroup[]> {
    const rows = await getDb().menuItem.findMany({
      where: buildMenuWhere(query),
      include: {
        ...itemInclude,
        category: { select: { id: true, name: true, slug: true, section: true, description: true } },
      },
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }, { name: "asc" }],
    });

    const groups = new Map<string, MenuGroup>();
    for (const row of rows) {
      const { id, name, slug, section, description } = row.category;
      let group = groups.get(id);
      if (!group) {
        group = { category: { id, name, slug, section, description }, items: [] };
        groups.set(id, group);
      }
      group.items.push(toView(row));
    }
    return [...groups.values()];
  },

  async bySlug(slug: string): Promise<MenuItemView | null> {
    const row = await getDb().menuItem.findUnique({ where: { slug }, include: itemInclude });
    return row ? toView(row) : null;
  },

  /** Featured items, including out-of-season ones (shown as "returns in spring"). */
  async featured(): Promise<MenuItemView[]> {
    const rows = await getDb().menuItem.findMany({
      where: { isFeatured: true },
      include: itemInclude,
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      take: 6,
    });
    return rows.map(toView);
  },

  async slugs(): Promise<{ slug: string; updatedAt: Date }[]> {
    return getDb().menuItem.findMany({ select: { slug: true, updatedAt: true }, orderBy: { slug: "asc" } });
  },
};

// ─── Cached reads for pages ─────────────────────────────────────────────────
// Server Components use these. Results are cached for minutes under the "menu"
// tag, so an admin tool could refresh them with revalidateTag("menu").

export async function getMenuCategories(): Promise<MenuCategoryView[]> {
  "use cache";
  cacheTag("menu");
  cacheLife("minutes");
  return menuQueries.categories();
}

export async function searchMenu(query: MenuQuery): Promise<MenuGroup[]> {
  "use cache";
  cacheTag("menu");
  cacheLife("minutes");
  return menuQueries.search(query);
}

export async function getMenuItemBySlug(slug: string): Promise<MenuItemView | null> {
  "use cache";
  cacheTag("menu", `menu-item:${slug}`);
  cacheLife("minutes");
  return menuQueries.bySlug(slug);
}

export async function getFeaturedMenuItems(): Promise<MenuItemView[]> {
  "use cache";
  cacheTag("menu");
  cacheLife("minutes");
  return menuQueries.featured();
}

export async function getMenuItemSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  "use cache";
  cacheTag("menu");
  cacheLife("hours");
  return menuQueries.slugs();
}
