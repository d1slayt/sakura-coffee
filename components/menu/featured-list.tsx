"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { MenuItemView } from "@/server/menu";
import { BlossomMark } from "@/components/ui/blossom-mark";
import { cn, formatPrice } from "@/lib/utils";

interface Labels {
  seasonalLabel: string;
  unavailable: string;
}

type FeaturedItem = Pick<
  MenuItemView,
  "slug" | "name" | "description" | "priceCents" | "isAvailable" | "availabilityNote" | "imageUrl" | "imageAlt" | "brewNote"
>;

/**
 * An index of featured items beside a "plate" that shows the photo of the
 * row being hovered or focused. Out-of-season items without a photo show a
 * typographic card in sakura pink instead. On small screens each row carries
 * its own thumbnail, because there's no hover.
 */
export function FeaturedList({ items, labels }: { items: FeaturedItem[]; labels: Labels }) {
  const [activeSlug, setActiveSlug] = useState(items[0]?.slug);
  const active = items.find((i) => i.slug === activeSlug) ?? items[0];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-8 lg:gap-6">
      <ol className="lg:col-span-5" onMouseLeave={() => setActiveSlug(items[0]?.slug)}>
        {items.map((item, index) => (
          <li key={item.slug} className="border-t border-line last:border-b">
            <Link
              href={`/menu/${item.slug}`}
              onMouseEnter={() => setActiveSlug(item.slug)}
              onFocus={() => setActiveSlug(item.slug)}
              // Phones: [thumbnail | text], price sits under the text so the name gets the full width.
              // Tablets: [thumbnail | text | price]. Desktop: [number | text | price] beside the photo plate.
              className="group grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-x-4 py-6 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:gap-x-5 lg:grid-cols-[3rem_minmax(0,1fr)_auto] lg:gap-x-4"
            >
              <span aria-hidden className="lg:pt-2">
                <span className="meta hidden text-muted tabular lg:inline">{String(index + 1).padStart(2, "0")}</span>
                {item.imageUrl ? (
                  <span className="relative block aspect-square w-full overflow-hidden bg-paper lg:hidden">
                    <Image src={item.imageUrl} alt="" fill sizes="(min-width: 640px) 72px, 56px" quality={70} className="object-cover" />
                  </span>
                ) : (
                  <span className="flex aspect-square w-full items-center justify-center bg-sakura lg:hidden">
                    <BlossomMark className="size-6 text-rose-ink" />
                  </span>
                )}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block font-display text-[1.25rem] leading-tight hyphens-auto [overflow-wrap:anywhere] transition-colors duration-(--duration-quick) group-hover:text-rose-ink min-[360px]:text-[1.75rem] sm:text-[2rem]",
                    !item.isAvailable && "text-muted",
                  )}
                >
                  {item.name}
                </span>
                <span className="mt-2 block max-w-[46ch] text-[0.9375rem] text-muted">{item.description}</span>
                {item.isAvailable ? (
                  item.brewNote ? (
                    <span className="meta mt-3 block text-muted">{item.brewNote}</span>
                  ) : null
                ) : (
                  <span className="meta mt-3 inline-flex items-center gap-2 text-rose-ink">
                    <BlossomMark className="size-3.5" />
                    {item.availabilityNote ?? labels.unavailable}
                  </span>
                )}
                {item.isAvailable ? (
                  <span className="mt-3 block font-semibold tabular sm:hidden">{formatPrice(item.priceCents)}</span>
                ) : null}
              </span>
              <span className="hidden pt-2 text-right font-semibold tabular sm:block">
                {item.isAvailable ? formatPrice(item.priceCents) : <span className="sr-only">{labels.unavailable}</span>}
                {!item.isAvailable ? <span aria-hidden className="text-muted">—</span> : null}
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="hidden lg:col-span-3 lg:block" aria-hidden>
        <div className="sticky top-[calc(var(--spacing-header)+2rem)]">
          <div className="relative aspect-[3/4] overflow-hidden bg-paper">
            <AnimatePresence initial={false}>
              {active ? (
                <motion.div
                  key={active.slug}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {active.imageUrl ? (
                    <Image
                      src={active.imageUrl}
                      alt=""
                      fill
                      sizes="(min-width: 1440px) 340px, 24vw"
                      quality={70}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col justify-between bg-sakura p-6 text-ink">
                      <span className="meta">{labels.seasonalLabel}</span>
                      <BlossomMark className="size-24 self-center text-rose-ink" />
                      <span className="font-display text-display-s italic">{active.name}</span>
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          {active ? (
            <p className="mt-3 font-display text-[0.9375rem] italic text-muted">{active.imageAlt ?? active.availabilityNote}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
