import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { navigation, siteConfig } from "@/lib/site";
import { displayTime } from "@/lib/utils";

export function SiteFooter() {
  const t = getDictionary();
  return (
    <footer className="surface-dark bg-ink text-paper">
      <div className="container-page grid gap-10 pt-14 pb-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4">
          <Link href="/" aria-label={t.nav.home} className="font-display text-[1.75rem] leading-none font-medium tracking-[-0.02em]">
            SakuraCoffee
          </Link>
          <nav aria-label={t.a11y.footerNavigation} className="mt-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw">
                    {t.nav.items[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <address className="not-italic text-steel lg:col-span-3 lg:col-start-7">
          {siteConfig.demo.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <a href={`mailto:${siteConfig.demo.email}`} className="link-text mt-2 inline-block break-all text-paper">
            {siteConfig.demo.email}
          </a>
        </address>

        <dl className="space-y-1 lg:col-span-3">
          {siteConfig.hours.map((h) => (
            <div key={h.id} className="flex gap-3">
              <dt className="w-16 text-steel">{t.hoursShort[h.id]}</dt>
              <dd className="tabular">
                {displayTime(h.opens)}–{displayTime(h.closes)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="container-page">
        <div className="space-y-1 border-t border-line-inverse py-6 text-[0.8125rem] text-steel">
          <p>
            {t.footer.rights}
          </p>
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
