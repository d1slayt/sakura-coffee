import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { cn, formatPrice } from "@/lib/utils";
import type { MenuGroup, MenuItemView } from "@/server/menu";
import { DietaryTags, IngredientFacts } from "./item-facts";

function MenuRow({ item }: { item: MenuItemView }) {
  const t = getDictionary().menu;
  return (
    <li className="border-b border-line py-6">
      <div className="flex items-baseline gap-3">
        <h3 className={cn("min-w-0 font-display text-[1.5rem] leading-tight", !item.isAvailable && "text-muted")}>
          <Link href={`/menu/${item.slug}`} className="link-draw hover:text-pine">
            {item.name}
          </Link>
        </h3>
        <span aria-hidden className="min-w-4 flex-1 translate-y-[-0.3em] border-b border-dotted border-steel" />
        <p className="shrink-0 font-semibold tabular">
          {item.isAvailable ? (
            formatPrice(item.priceCents)
          ) : (
            <>
              <span aria-hidden className="text-muted">—</span>
              <span className="sr-only">{t.unavailable}</span>
            </>
          )}
        </p>
      </div>
      <div className="max-w-[60ch]">
        <DietaryTags tags={item.dietaryTags} className="mt-2" />
        <p className="mt-2">{item.description}</p>
        {item.brewNote && item.isAvailable ? <p className="meta mt-2 font-medium text-muted">{item.brewNote}</p> : null}
        {!item.isAvailable ? (
          <p className="meta mt-3 inline-block bg-pink px-1.5 py-0.5 text-ink">{item.availabilityNote ?? t.unavailable}</p>
        ) : null}
        <IngredientFacts item={item} className="mt-4" />
      </div>
    </li>
  );
}

export function MenuResults({ groups }: { groups: MenuGroup[] }) {
  return (
    <div className="space-y-16">
      {groups.map((group) => (
        <section
          key={group.category.id}
          aria-labelledby={`cat-${group.category.slug}`}
          className="grid gap-y-6 md:grid-cols-12 md:gap-x-6"
        >
          <header className="md:col-span-4">
            <h2 id={`cat-${group.category.slug}`} className="heading md:pt-5">
              {group.category.name}
            </h2>
            {group.category.description ? <p className="mt-2 max-w-[30ch] text-muted">{group.category.description}</p> : null}
          </header>
          <ul className="border-t-2 border-ink md:col-span-8">
            {group.items.map((item) => (
              <MenuRow key={item.id} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
