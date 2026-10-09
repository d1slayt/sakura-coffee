import Link from "next/link";
import { Suspense } from "react";
import { Menu } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { actionClass } from "@/components/ui/action";
import { Logo } from "@/components/ui/logo";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { NavLinksView } from "./nav-links-view";
import { OpenStatus } from "./open-status";

/** Shown in the static shell until the client knows the current path. */
function MobileNavFallback({ label }: { label: string }) {
  return (
    <div className="md:hidden">
      <button type="button" aria-expanded={false} disabled className="-mr-2 inline-flex size-11 items-center justify-center">
        <span className="sr-only">{label}</span>
        <Menu aria-hidden strokeWidth={1.5} className="size-6" />
      </button>
    </div>
  );
}

export function SiteHeader() {
  const t = getDictionary();
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ivory">
      <div className="container-page flex h-(--spacing-header) items-center justify-between gap-6">
        <div className="flex items-center gap-10 lg:gap-14">
          <Link href="/" aria-label={t.nav.home} className="py-2">
            <Logo />
          </Link>
          <Suspense fallback={<NavLinksView label={t.a11y.mainNavigation} itemLabels={t.nav.items} pathname={null} />}>
            <NavLinks label={t.a11y.mainNavigation} itemLabels={t.nav.items} />
          </Suspense>
        </div>

        <div className="flex items-center gap-6">
          <OpenStatus labels={t.status} className="hidden lg:flex" />
          <Link href="/visit#book" className={actionClass("outline", "default", "hidden min-h-10 px-5 text-sm md:inline-flex")}>
            {t.nav.cta}
          </Link>
          <Link href="/visit#book" className="meta inline-flex min-h-11 items-center px-1 md:hidden">
            {t.nav.ctaShort}
          </Link>
          <Suspense fallback={<MobileNavFallback label={t.a11y.openMenu} />}>
            <MobileNav
              labels={{
                open: t.a11y.openMenu,
                close: t.a11y.closeMenu,
                nav: t.a11y.mainNavigation,
                cta: t.nav.cta,
                hours: t.visit.hours,
                items: t.nav.items,
                hourLabels: t.hours,
              }}
            />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
