"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { filterMenu } from "@/lib/menu-filter";
import type { MenuCategoryView, MenuItemView } from "@/lib/menu-types";
import { menuQueryFromSearchParams, parseMenuQuery, type MenuQuery } from "@/lib/validations/menu";
import { MenuFilters } from "./menu-filters";
import { MenuResults } from "./menu-results";

interface Props {
  items: MenuItemView[];
  categories: MenuCategoryView[];
}

/**
 * Menu search for the static GitHub Pages build: the URL still drives the
 * filters, but results are computed in the browser from bundled data.
 */
export function StaticMenuBrowser(props: Props) {
  const params = useSearchParams();
  return <StaticMenuView {...props} query={menuQueryFromSearchParams(new URLSearchParams(params.toString()))} />;
}

/** Unfiltered render, used as the prerendered HTML before search params are known. */
export function StaticMenuFallback(props: Props) {
  return <StaticMenuView {...props} query={parseMenuQuery({})} />;
}

function StaticMenuView({ items, categories, query }: Props & { query: MenuQuery }) {
  const t = getDictionary().menu;
  const groups = filterMenu(items, categories, query);
  const count = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <div className="z-30 md:sticky md:top-(--spacing-header)">
        <MenuFilters
          query={query}
          categories={categories.map(({ slug, name }) => ({ slug, name }))}
          labels={{
            searchLabel: t.searchLabel,
            searchPlaceholder: t.searchPlaceholder,
            categoryLabel: t.categoryLabel,
            allCategories: t.allCategories,
            filtersLabel: t.filtersLabel,
            filters: t.filters,
            clear: t.clear,
          }}
        />
      </div>

      <p className="meta mt-6 mb-10 text-muted" role="status" aria-live="polite">
        {t.results(count)}
      </p>

      {count > 0 ? (
        <MenuResults groups={groups} />
      ) : (
        <div className="border-t border-line py-16">
          <p className="font-display text-display-s">{t.emptyTitle}</p>
          <p className="mt-2 text-muted">{t.emptyBody}</p>
          <Link href="/menu" className="meta mt-6 inline-flex min-h-11 items-center text-pine hover:text-ink">
            {t.clear}
          </Link>
        </div>
      )}
    </>
  );
}
