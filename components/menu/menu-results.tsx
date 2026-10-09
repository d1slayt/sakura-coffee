import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { cn, formatPrice } from "@/lib/utils";
import type { MenuGroup, MenuItemView } from "@/server/menu";
import { BlossomMark } from "@/components/ui/blossom-mark";
import { DietaryTags, IngredientFacts } from "./item-facts";

function MenuRow({ item }: { item: MenuItemView }) {
  const t = getDictionary().menu;
  return (
    <li className="grid grid-cols-[1fr_auto] gap-x-6 border-t border-line py-7">
      <div className="min-w-0">
        <h3 className={cn("font-display text-[1.625rem] leading-tight", !item.isAvailable && "text-muted")}>
          <Link href={`/menu/${item.slug}`} className="link-draw">
            {item.name}
          </Link>
        </h3>
        <DietaryTags tags={item.dietaryTags} className="mt-2" />
        <p className="mt-3 max-w-[56ch] text-coffee">{item.description}</p>
        {item.brewNote && item.isAvailable ? <p className="meta mt-3 text-muted">{item.brewNote}</p> : null}
        {!item.isAvailable ? (
          <p className="meta mt-3 inline-flex items-center gap-2 text-rose-ink">
            <BlossomMark className="size-3.5" />
            {item.availabilityNote ?? t.unavailable}
          </p>
        ) : null}
        <IngredientFacts item={item} className="mt-5" />
      </div>
      <p className="pt-1.5 text-right text-lg font-semibold tabular">
        {item.isAvailable ? (
          formatPrice(item.priceCents)
        ) : (
          <>
            <span aria-hidden className="text-muted">—</span>
            <span className="sr-only">{t.unavailable}</span>
          </>
        )}
      </p>
    </li>
  );
}

export function MenuResults({ groups }: { groups: MenuGroup[] }) {
  const t = getDictionary().menu;
  return (
    <div className="space-y-20">
      {groups.map((group) => (
        <section
          key={group.category.id}
          aria-labelledby={`cat-${group.category.slug}`}
          className="grid gap-y-6 md:grid-cols-12 md:gap-x-6"
        >
          <header className="md:col-span-4">
            <div className="md:pt-7">
              <p className="meta text-muted">{t.sections[group.category.section]}</p>
              <h2 id={`cat-${group.category.slug}`} className="mt-2 font-display text-display-m">
                {group.category.name}
              </h2>
              {group.category.description ? (
                <p className="mt-3 max-w-[30ch] text-muted">{group.category.description}</p>
              ) : null}
            </div>
          </header>
          <ul className="md:col-span-8">
            {group.items.map((item) => (
              <MenuRow key={item.id} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
