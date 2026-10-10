import { getDictionary } from "@/lib/i18n";
import { photos } from "@/lib/images";
import { siteConfig } from "@/lib/site";
import { displayTime } from "@/lib/utils";
import { ActionLink } from "@/components/ui/action";
import { Photo } from "@/components/ui/photo";

/** Opening hours set large, like the sign on the door; address and email below. */
export function VisitSummary() {
  const dict = getDictionary();
  const t = dict.home.visit;
  return (
    <section aria-labelledby="visit-title" className="bg-paper-deep py-(--spacing-section)">
      <div className="container-page grid gap-y-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-7">
          <h2 id="visit-title" className="heading">
            {t.title}
          </h2>
          <dl className="mt-8 border-t-2 border-ink">
            {siteConfig.hours.map((h) => (
              <div key={h.id} className="flex flex-wrap items-baseline justify-between gap-x-6 border-b border-line-strong py-4">
                <dt className="font-semibold">{dict.hours[h.id]}</dt>
                <dd className="font-display text-display-l tabular">
                  {displayTime(h.opens)}–{displayTime(h.closes)}
                </dd>
              </div>
            ))}
          </dl>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="meta text-muted">{t.address}</dt>
              <dd className="mt-1">{siteConfig.demo.addressLines.join(", ")}</dd>
            </div>
            <div>
              <dt className="meta text-muted">{t.contact}</dt>
              <dd className="mt-1">
                <a href={`mailto:${siteConfig.demo.email}`} className="link-text break-all">
                  {siteConfig.demo.email}
                </a>
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-muted">{dict.demo.notice}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ActionLink href="/visit#book">{dict.nav.cta}</ActionLink>
            <ActionLink href="/visit" variant="text">
              {t.cta}
            </ActionLink>
          </div>
        </div>

        <Photo
          photo={photos.atmosphereWindow}
          ratio="4/5"
          sizes="(min-width: 1024px) 30vw, 0px"
          className="max-lg:hidden lg:col-span-4 lg:col-start-9 lg:self-end"
        />
      </div>
    </section>
  );
}
