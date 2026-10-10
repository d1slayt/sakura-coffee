import Link from "next/link";
import type { MenuItemView } from "@/server/menu";
import { formatPrice } from "@/lib/utils";

type FeaturedItem = Pick<MenuItemView, "slug" | "name" | "description" | "priceCents" | "isAvailable" | "availabilityNote">;

/**
 * A printed menu board: name, a dotted leader, the price; one line of
 * description underneath. An out-of-season item shows when it comes back
 * instead of a price.
 */
export function FeaturedList({ items, unavailableLabel }: { items: FeaturedItem[]; unavailableLabel: string }) {
  return (
    <ul className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
      {items.map((item) => (
        <li key={item.slug} className="border-b border-line">
          <Link href={`/menu/${item.slug}`} className="group block py-5">
            <span className="flex items-baseline gap-3">
              <span className="min-w-0 font-display text-[1.25rem] leading-tight group-hover:text-pine max-[359px]:hyphens-auto max-[359px]:[overflow-wrap:anywhere] min-[360px]:text-[1.375rem] sm:text-[1.5rem]">
                {item.name}
              </span>
              <span aria-hidden className="min-w-4 flex-1 translate-y-[-0.3em] border-b border-dotted border-steel" />
              <span className="shrink-0 font-semibold tabular">
                {item.isAvailable ? formatPrice(item.priceCents) : <span aria-hidden className="text-muted">—</span>}
              </span>
            </span>
            <span className="mt-1.5 block max-w-[48ch] text-[0.9375rem] text-muted">{item.description}</span>
            {!item.isAvailable ? (
              <span className="meta mt-2 inline-block bg-pink px-1.5 py-0.5 text-ink">{item.availabilityNote ?? unavailableLabel}</span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
