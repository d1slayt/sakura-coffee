import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { navigation, siteConfig } from "@/lib/site";
import { BlossomMark } from "@/components/ui/blossom-mark";

export function SiteFooter() {
  const t = getDictionary();
  return (
    <footer className="surface-dark bg-ink text-ivory">
      <div className="container-page grid gap-12 pt-20 pb-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <Link href="/" aria-label={t.nav.home} className="inline-flex items-center gap-3">
            <BlossomMark className="size-8 text-sakura" />
            <span className="font-display text-[2.25rem] leading-none tracking-[-0.01em]">
              Sakura<em>Coffee</em>
            </span>
          </Link>
          <p className="mt-5 max-w-xs font-display text-xl italic text-ivory-dim">{t.footer.tagline}</p>
        </div>

        <nav aria-label={t.a11y.footerNavigation} className="md:col-span-2">
          <p className="meta text-ivory-dim">{t.footer.explore}</p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/" className="link-draw">
                {t.footer.home}
              </Link>
            </li>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-draw">
                  {t.nav.items[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="meta text-ivory-dim">{t.footer.visit}</p>
          <address className="mt-4 not-italic">
            {siteConfig.demo.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <a href={`mailto:${siteConfig.demo.email}`} className="link-text mt-2 inline-block">
              {siteConfig.demo.email}
            </a>
          </address>
          <dl className="mt-4 space-y-1 text-[0.9375rem]">
            {siteConfig.hours.map((h) => (
              <div key={h.id} className="flex gap-3">
                <dt className="text-ivory-dim">{t.hours[h.id]}</dt>
                <dd className="tabular">
                  {h.opens}–{h.closes}
                </dd>
              </div>
            ))}
          </dl>
          <p className="meta mt-4 text-sakura">{t.demo.badge}</p>
        </div>

        <div className="md:col-span-2">
          <p className="meta text-ivory-dim">{t.footer.colophon}</p>
          <p className="mt-4 text-[0.9375rem] text-ivory-dim">{t.footer.colophonBody}</p>
        </div>
      </div>

      <div className="container-page">
        <div className="flex flex-col gap-3 border-t border-line-inverse py-6 text-[0.8125rem] text-ivory-dim md:flex-row md:justify-between">
          <p>
            © {siteConfig.name} — {t.footer.rights}
          </p>
          <p>
            <span lang="ja">桜</span> — {t.footer.sakura}
          </p>
        </div>
      </div>
    </footer>
  );
}
