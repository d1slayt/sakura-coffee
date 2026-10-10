import { Suspense } from "react";
import { getDictionary } from "@/lib/i18n";
import { deferToRequest, getFeaturedMenuItems } from "@/server/menu";
import { FeaturedList } from "@/components/menu/featured-list";
import { ActionLink } from "@/components/ui/action";
import { DataBoundary } from "@/components/ui/data-boundary";

async function FeaturedItems() {
  // Read at request time (cached for minutes by getFeaturedMenuItems), so the
  // static shell — and the production build — never depends on the database.
  await deferToRequest();
  const t = getDictionary().home.menu;
  const items = await getFeaturedMenuItems();
  if (items.length === 0) return <p className="py-10 text-muted">{t.empty}</p>;
  return (
    <FeaturedList
      items={items.map(({ slug, name, description, priceCents, isAvailable, availabilityNote }) => ({
        slug,
        name,
        description,
        priceCents,
        isAvailable,
        availabilityNote,
      }))}
      unavailableLabel={t.unavailable}
    />
  );
}

function FeaturedSkeleton() {
  return (
    <div aria-hidden className="grid gap-x-16 md:grid-cols-2">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border-b border-line py-5">
          <div className="h-7 w-2/3 bg-paper-deep" />
          <div className="mt-2 h-4 w-4/5 bg-paper-deep" />
        </div>
      ))}
    </div>
  );
}

export function FeaturedMenu() {
  const dict = getDictionary();
  const t = dict.home.menu;
  return (
    <section aria-labelledby="featured-title" className="container-page py-(--spacing-section)">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 border-ink pb-3">
        <h2 id="featured-title" className="heading">
          {t.title}
        </h2>
        <ActionLink href="/menu" variant="text">
          {t.cta}
        </ActionLink>
      </div>
      <DataBoundary title={dict.error.dataTitle} body={dict.error.dataBody} retryLabel={dict.error.retry}>
        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedItems />
        </Suspense>
      </DataBoundary>
      <p className="meta mt-5 font-medium text-muted">{t.note}</p>
    </section>
  );
}
