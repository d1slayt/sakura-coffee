import { Suspense } from "react";
import { getDictionary } from "@/lib/i18n";
import { deferToRequest, getFeaturedMenuItems } from "@/server/menu";
import { FeaturedList } from "@/components/menu/featured-list";
import { ActionLink } from "@/components/ui/action";
import { DataBoundary } from "@/components/ui/data-boundary";
import { EmphasisText } from "@/components/ui/emphasis";
import { SectionLabel } from "@/components/ui/section-label";

async function FeaturedItems() {
  // Read at request time (cached for minutes by getFeaturedMenuItems), so the
  // static shell — and the production build — never depends on the database.
  await deferToRequest();
  const t = getDictionary().home.featured;
  const items = await getFeaturedMenuItems();
  if (items.length === 0) return <p className="border-y border-line py-10 text-muted">{t.empty}</p>;
  return (
    <FeaturedList
      items={items.map(({ slug, name, description, priceCents, isAvailable, availabilityNote, imageUrl, imageAlt, brewNote }) => ({
        slug,
        name,
        description,
        priceCents,
        isAvailable,
        availabilityNote,
        imageUrl,
        imageAlt,
        brewNote,
      }))}
      labels={{ seasonalLabel: t.seasonalLabel, unavailable: t.unavailable }}
    />
  );
}

function FeaturedSkeleton() {
  return (
    <div aria-hidden className="grid gap-6 lg:grid-cols-8">
      <div className="lg:col-span-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="border-t border-line py-6">
            <div className="h-8 w-1/2 bg-paper" />
            <div className="mt-3 h-4 w-4/5 bg-paper" />
          </div>
        ))}
      </div>
      <div className="hidden aspect-[3/4] bg-paper lg:col-span-3 lg:block" />
    </div>
  );
}

export function FeaturedMenu() {
  const dict = getDictionary();
  const t = dict.home.featured;
  return (
    <section aria-labelledby="featured-title" className="container-page py-(--spacing-section)">
      {/* Two columns only from 1024px: on tablets the heading column was too narrow for the display type. */}
      <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)]">
            <SectionLabel>{t.label}</SectionLabel>
            <h2 id="featured-title" className="mt-6 font-display text-display-m">
              <EmphasisText value={t.title} />
            </h2>
            <p className="mt-5 max-w-[34ch] text-muted">{t.intro}</p>
            <ActionLink href="/menu" variant="text" className="mt-6">
              {t.cta}
            </ActionLink>
          </div>
        </div>
        <div className="lg:col-span-8">
          <DataBoundary title={dict.error.dataTitle} body={dict.error.dataBody} retryLabel={dict.error.retry}>
            <Suspense fallback={<FeaturedSkeleton />}>
              <FeaturedItems />
            </Suspense>
          </DataBoundary>
        </div>
      </div>
    </section>
  );
}
