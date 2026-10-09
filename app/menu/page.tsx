import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getDictionary } from "@/lib/i18n";
import { parseMenuQuery } from "@/lib/validations/menu";
import { getMenuCategories, searchMenu } from "@/server/menu";
import { MenuFilters } from "@/components/menu/menu-filters";
import { MenuResults } from "@/components/menu/menu-results";
import { DataBoundary } from "@/components/ui/data-boundary";
import { EmphasisText } from "@/components/ui/emphasis";

const t = getDictionary();

export const metadata: Metadata = {
  title: t.menu.metaTitle,
  description: t.menu.metaDescription,
  alternates: { canonical: "/menu" },
  openGraph: { title: `${t.menu.metaTitle} — SakuraCoffee`, description: t.menu.metaDescription, url: "/menu" },
};

async function MenuBrowser({ searchParams }: { searchParams: PageProps<"/menu">["searchParams"] }) {
  const query = parseMenuQuery(await searchParams);
  const [categories, groups] = await Promise.all([getMenuCategories(), searchMenu(query)]);
  const count = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      {/* Sticky only where there is room for it; on phones it would cover half the screen. */}
      <div className="z-30 md:sticky md:top-(--spacing-header)">
        <MenuFilters
          query={query}
          categories={categories.map(({ slug, name }) => ({ slug, name }))}
          labels={{
            searchLabel: t.menu.searchLabel,
            searchPlaceholder: t.menu.searchPlaceholder,
            categoryLabel: t.menu.categoryLabel,
            allCategories: t.menu.allCategories,
            filtersLabel: t.menu.filtersLabel,
            filters: t.menu.filters,
            clear: t.menu.clear,
          }}
        />
      </div>

      <p className="meta mt-6 mb-10 text-muted" role="status" aria-live="polite">
        {t.menu.results(count)}
      </p>

      {count > 0 ? (
        <MenuResults groups={groups} />
      ) : (
        <div className="border-t border-line py-16">
          <p className="font-display text-display-s">{t.menu.emptyTitle}</p>
          <p className="mt-2 text-muted">{t.menu.emptyBody}</p>
          <Link href="/menu" className="meta mt-6 inline-flex min-h-11 items-center text-rose-ink hover:text-ink">
            {t.menu.clear}
          </Link>
        </div>
      )}
    </>
  );
}

function MenuSkeleton() {
  return (
    <div aria-hidden>
      <div className="h-[11.5rem] border-y border-line-strong bg-ivory" />
      <p className="meta mt-6 mb-10 text-muted">{t.menu.loading}</p>
      {[0, 1, 2].map((i) => (
        <div key={i} className="grid gap-6 border-t border-line py-8 md:grid-cols-12">
          <div className="h-10 bg-paper md:col-span-3" />
          <div className="space-y-3 md:col-span-8 md:col-start-5">
            <div className="h-7 w-1/2 bg-paper" />
            <div className="h-4 w-4/5 bg-paper" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MenuPage(props: PageProps<"/menu">) {
  return (
    <div className="container-page pt-12 pb-(--spacing-section) md:pt-20">
      <header className="grid gap-y-6 pb-12 md:grid-cols-12 md:gap-x-6 md:pb-16">
        <p className="meta text-muted md:col-span-12">{t.menu.eyebrow}</p>
        <h1 className="font-display text-display-xl md:col-span-7">
          <EmphasisText value={t.menu.title} />
        </h1>
        <div className="self-end md:col-span-4 md:col-start-9">
          <p className="text-lede text-coffee">{t.menu.intro}</p>
          <p className="mt-4 text-sm text-muted">{t.menu.allergenNote}</p>
        </div>
      </header>

      <DataBoundary title={t.error.dataTitle} body={t.error.dataBody} retryLabel={t.error.retry}>
        <Suspense fallback={<MenuSkeleton />}>
          <MenuBrowser searchParams={props.searchParams} />
        </Suspense>
      </DataBoundary>
    </div>
  );
}
