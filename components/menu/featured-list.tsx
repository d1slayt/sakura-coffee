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
              className="group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-start gap-x-3 py-6 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-x-4"
            >
              <span className="meta pt-2 text-muted tabular" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex gap-4">
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block font-display text-[1.75rem] leading-tight transition-colors duration-(--duration-quick) group-hover:text-rose-ink sm:text-[2rem]",
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
                </span>
                {item.imageUrl ? (
                  <span className="relative size-18 shrink-0 overflow-hidden bg-paper lg:hidden">
                    <Image src={item.imageUrl} alt="" fill sizes="72px" quality={70} className="object-cover" />
                  </span>
                ) : null}
              </span>
              <span className="pt-2 text-right font-semibold tabular">
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
