import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { categories, ingredients, items } from "./seed-data";

/**
 * Idempotent seed: upserts the demo menu by slug/name, so it can be re-run
 * safely. It never touches reservations or contact messages.
 */
async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set. Copy .env.example to .env first.");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    const categoryIds = new Map<string, string>();
    for (const [index, category] of categories.entries()) {
      const row = await prisma.menuCategory.upsert({
        where: { slug: category.slug },
        create: { ...category, sortOrder: index },
        update: { ...category, sortOrder: index },
        select: { id: true },
      });
      categoryIds.set(category.slug, row.id);
    }

    const ingredientIds = new Map<string, string>();
    for (const ingredient of ingredients) {
      const row = await prisma.ingredient.upsert({
        where: { name: ingredient.name },
        create: ingredient,
        update: { allergens: ingredient.allergens },
        select: { id: true },
      });
      ingredientIds.set(ingredient.name, row.id);
    }

    const sortCounters = new Map<string, number>();
    for (const item of items) {
      const categoryId = categoryIds.get(item.category);
      if (!categoryId) throw new Error(`Unknown category "${item.category}" for ${item.slug}`);
      const sortOrder = sortCounters.get(item.category) ?? 0;
      sortCounters.set(item.category, sortOrder + 1);

      const ingredientRows = item.ingredients.map((name, position) => {
        const ingredientId = ingredientIds.get(name);
        if (!ingredientId) throw new Error(`Unknown ingredient "${name}" for ${item.slug}`);
        return { ingredientId, position };
      });

      const data = {
        name: item.name,
        description: item.description,
        priceCents: item.priceCents,
        categoryId,
        isAvailable: item.isAvailable ?? true,
        availabilityNote: item.availabilityNote ?? null,
        isFeatured: item.isFeatured ?? false,
        imageUrl: item.image?.src ?? null,
        imageAlt: item.image?.alt ?? null,
        dietaryTags: item.dietaryTags,
        brewNote: item.brewNote ?? null,
        sortOrder,
      };

      await prisma.$transaction(async (tx) => {
        const menuItem = await tx.menuItem.upsert({
          where: { slug: item.slug },
          create: { slug: item.slug, ...data },
          update: data,
          select: { id: true },
        });
        await tx.menuItemIngredient.deleteMany({ where: { menuItemId: menuItem.id } });
        await tx.menuItemIngredient.createMany({
          data: ingredientRows.map((r) => ({ ...r, menuItemId: menuItem.id })),
        });
      });
    }

    // Ingredients no longer used by any item (e.g. after renaming) are removed.
    const orphans = await prisma.ingredient.deleteMany({ where: { items: { none: {} } } });
    if (orphans.count > 0) console.log(`Removed ${orphans.count} unused ingredients.`);

    console.log(
      `Seeded ${categories.length} categories, ${ingredients.length} ingredients, ${items.length} menu items.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
