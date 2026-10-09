import { categories, ingredients, items } from "@/prisma/seed-data";
import { ALLERGEN_ORDER, type MenuCategoryView, type MenuItemView } from "./menu-types";

/**
 * The demo menu built from the same seed data that fills PostgreSQL. Used
 * only by the static GitHub Pages build, so both versions show the same menu.
 */
const allergensByIngredient = new Map(ingredients.map((i) => [i.name, i.allergens]));

export const staticCategories: MenuCategoryView[] = categories.map((c) => ({
  id: c.slug,
  name: c.name,
  slug: c.slug,
  description: c.description,
  section: c.section,
  itemCount: items.filter((i) => i.category === c.slug).length,
}));

export const staticItems: MenuItemView[] = categories.flatMap((category) =>
  items
    .filter((item) => item.category === category.slug)
    .map((item) => {
      const allergenSet = new Set(item.ingredients.flatMap((name) => allergensByIngredient.get(name) ?? []));
      return {
        id: item.slug,
        name: item.name,
        slug: item.slug,
        description: item.description,
        priceCents: item.priceCents,
        isAvailable: item.isAvailable ?? true,
        availabilityNote: item.availabilityNote ?? null,
        isFeatured: item.isFeatured ?? false,
        imageUrl: item.image?.src ?? null,
        imageAlt: item.image?.alt ?? null,
        brewNote: item.brewNote ?? null,
        dietaryTags: item.dietaryTags,
        ingredients: item.ingredients,
        allergens: ALLERGEN_ORDER.filter((a) => allergenSet.has(a)),
        category: { name: category.name, slug: category.slug, section: category.section },
      };
    }),
);
