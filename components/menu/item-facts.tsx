import { getDictionary } from "@/lib/i18n";
import type { MenuItemView } from "@/server/menu";
import { cn } from "@/lib/utils";

/** Dietary tags in sage small caps. */
export function DietaryTags({ tags, className }: { tags: MenuItemView["dietaryTags"]; className?: string }) {
  const t = getDictionary();
  if (tags.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap gap-x-3", className)} aria-label={t.menu.dietaryLabel}>
      {tags.map((tag) => (
        <li key={tag} className="meta text-pine">
          {tag === "VEGAN_OPTION" ? t.menu.veganOption : t.dietary[tag]}
        </li>
      ))}
    </ul>
  );
}

/** Ingredients and the allergens derived from them. */
export function IngredientFacts({ item, className }: { item: Pick<MenuItemView, "ingredients" | "allergens">; className?: string }) {
  const t = getDictionary();
  return (
    <dl className={cn("grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[6.5rem_1fr]", className)}>
      <dt className="meta pt-0.5 text-muted">{t.menu.ingredients}</dt>
      <dd className="text-ink">{item.ingredients.join(", ")}</dd>
      <dt className="meta pt-0.5 text-muted">{t.menu.allergens}</dt>
      <dd className={item.allergens.length > 0 ? "font-semibold text-ink" : "text-muted"}>
        {item.allergens.length > 0 ? item.allergens.map((a) => t.allergens[a]).join(", ") : t.menu.noAllergens}
      </dd>
    </dl>
  );
}
