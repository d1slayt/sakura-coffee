import { getDictionary } from "@/lib/i18n";
import { photos } from "@/lib/images";
import { siteConfig } from "@/lib/site";
import { displayTime } from "@/lib/utils";
import { OpenStatus } from "@/components/layout/open-status";
import { ActionLink } from "@/components/ui/action";
import { Photo } from "@/components/ui/photo";

/**
 * The shopfront: a pine-green plane with what the place is and when it's open,
 * and a photograph that runs to the edge of the screen. On phones the photo
 * comes first and the green block follows it.
 */
export function Hero() {
  const dict = getDictionary();
  const t = dict.home.hero;

  return (
    <section aria-labelledby="hero-title" className="surface-dark bg-pine text-paper">
      <div className="grid lg:min-h-[min(calc(100svh-var(--spacing-header)),56rem)] lg:grid-cols-2">
        <Photo
          photo={photos.heroPour}
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          className="aspect-[4/3] sm:aspect-[16/10] lg:order-last lg:aspect-auto"
          imageClassName="object-[50%_60%]"
        />

        <div className="flex flex-col px-(--spacing-gutter) pt-10 pb-8 sm:pt-14 lg:pt-16 lg:pr-12 lg:pl-[max(var(--spacing-gutter),calc((100vw-var(--container-page))/2+var(--spacing-gutter)))]">
          <p className="meta text-pine-soft">{t.kicker}</p>
          <h1 id="hero-title" className="mt-5 max-w-[14ch] font-display text-display-xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-[42ch] text-lede">{t.intro}</p>
          <ActionLink href="/menu" tone="inverse" className="mt-8 self-start">
            {t.primaryCta}
          </ActionLink>

          <div className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-4 border-t border-line-inverse pt-5 lg:mt-auto">
            <dl className="flex flex-wrap gap-x-10 gap-y-3">
              {siteConfig.hours.map((h) => (
                <div key={h.id}>
                  <dt className="meta text-pine-soft">{dict.hoursShort[h.id]}</dt>
                  <dd className="tabular">
                    {displayTime(h.opens)}–{displayTime(h.closes)}
                  </dd>
                </div>
              ))}
            </dl>
            <OpenStatus labels={dict.status} className="text-paper sm:ml-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
