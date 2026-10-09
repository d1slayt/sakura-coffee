import { getDictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { ActionLink } from "@/components/ui/action";
import { EmphasisText } from "@/components/ui/emphasis";
import { SectionLabel } from "@/components/ui/section-label";

/** Compact visit block: practical information as a ruled table, nothing more. */
export function VisitSummary() {
  const dict = getDictionary();
  const t = dict.home.visit;
  return (
    <section aria-labelledby="visit-title" className="container-page border-t border-line py-24 md:py-32">
      <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-5">
          <SectionLabel>{t.label}</SectionLabel>
          <h2 id="visit-title" className="mt-6 font-display text-display-m">
            <EmphasisText value={t.title} />
          </h2>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            <ActionLink href="/visit">{t.cta}</ActionLink>
            <ActionLink href="/visit#book" variant="text" arrow={false}>
              {dict.nav.cta}
            </ActionLink>
          </div>
        </div>

        <dl className="md:col-span-6 md:col-start-7">
          <div className="grid gap-2 border-t border-line py-5 sm:grid-cols-[8rem_1fr]">
            <dt className="meta pt-1 text-muted">{t.hours}</dt>
            <dd className="space-y-1">
              {siteConfig.hours.map((h) => (
                <p key={h.id} className="flex justify-between gap-6">
                  <span>{dict.hours[h.id]}</span>
                  <span className="tabular">
                    {h.opens}–{h.closes}
                  </span>
                </p>
              ))}
            </dd>
          </div>
          <div className="grid gap-2 border-t border-line py-5 sm:grid-cols-[8rem_1fr]">
            <dt className="meta pt-1 text-muted">{t.address}</dt>
            <dd>
              {siteConfig.demo.addressLines.join(", ")}
              <span className="meta ml-3 bg-sakura px-1.5 py-0.5 text-ink">{dict.demo.badge}</span>
            </dd>
          </div>
          <div className="grid gap-2 border-y border-line py-5 sm:grid-cols-[8rem_1fr]">
            <dt className="meta pt-1 text-muted">{t.contact}</dt>
            <dd>
              <a href={`mailto:${siteConfig.demo.email}`} className="link-text">
                {siteConfig.demo.email}
              </a>
            </dd>
          </div>
          <p className="mt-4 text-sm text-muted">{dict.demo.notice}</p>
        </dl>
      </div>
    </section>
  );
}
