import type { Allergen, Prisma } from "@/lib/generated/prisma/client";
import type { MenuQuery } from "@/lib/validations/menu";

const FREE_FROM_ALLERGEN = { gluten: "GLUTEN", milk: "MILK", nuts: "NUTS" } as const satisfies Record<
  MenuQuery["free"][number],
  Allergen
>;

/**
 * Builds the Prisma filter for a menu query. `lib/menu-filter.ts` implements
 * the same rules in memory for the static demo build.
 */
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
