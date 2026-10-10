// STATIC DEMO OVERRIDE — copied over app/menu/page.tsx by scripts/prepare-pages.mjs.
// Search params aren't available when pre-rendering static HTML, so the full
// menu is rendered first and the browser applies the filters from the URL.
import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary } from "@/lib/i18n";
import { staticCategories, staticItems } from "@/lib/static-catalog";
import { StaticMenuBrowser, StaticMenuFallback } from "@/components/menu/static-menu-browser";

const t = getDictionary();

export const metadata: Metadata = {
  title: t.menu.metaTitle,
  description: t.menu.metaDescription,
  alternates: { canonical: "/menu" },
  openGraph: { title: `${t.menu.metaTitle} — SakuraCoffee`, description: t.menu.metaDescription, url: "/menu" },
};

export default function MenuPage() {
  return (
    <div className="container-page pt-12 pb-(--spacing-section) md:pt-20">
      <header className="grid gap-y-5 pb-10 md:grid-cols-12 md:gap-x-6 md:pb-14">
        <h1 className="font-display text-display-xl md:col-span-6">{t.menu.title}</h1>
        <div className="self-end md:col-span-5 md:col-start-8">
          <p className="text-lede">{t.menu.intro}</p>
          <p className="mt-3 text-sm text-muted">{t.menu.allergenNote}</p>
        </div>
      </header>

      <Suspense fallback={<StaticMenuFallback items={staticItems} categories={staticCategories} />}>
        <StaticMenuBrowser items={staticItems} categories={staticCategories} />
      </Suspense>
    </div>
  );
}
