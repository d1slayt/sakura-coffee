import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { photos } from "@/lib/images";
import { siteConfig } from "@/lib/site";
import { ContactForm } from "@/components/forms/contact-form";
import { ReservationForm } from "@/components/forms/reservation-form";
import { EmphasisText } from "@/components/ui/emphasis";
import { Photo } from "@/components/ui/photo";
import { SectionLabel } from "@/components/ui/section-label";

const t = getDictionary();

export const metadata: Metadata = {
  title: t.visit.metaTitle,
  description: t.visit.metaDescription,
  alternates: { canonical: "/visit" },
  openGraph: { title: `${t.visit.metaTitle} — SakuraCoffee`, description: t.visit.metaDescription, url: "/visit" },
};

export default function VisitPage() {
  const v = t.visit;
  return (
    <>
      <div className="container-page grid gap-y-12 pt-12 pb-20 md:grid-cols-12 md:gap-x-6 md:pt-20 md:pb-28">
        <header className="md:col-span-7">
          <p className="meta text-muted">{v.eyebrow}</p>
          <h1 className="mt-6 font-display text-display-l">
            <EmphasisText value={v.title} emClassName="text-rose-ink" />
          </h1>
        </header>

        <div className="md:col-span-5 md:row-span-2 md:self-end">
          <Photo
            photo={photos.visitInterior}
            ratio="4/5"
            sizes="(min-width: 768px) 40vw, 100vw"
            priority
            frameClassName="max-md:aspect-[3/2]!"
          />
        </div>

        <dl className="md:col-span-6">
          <div className="grid gap-2 border-t border-line py-5 sm:grid-cols-[9rem_1fr]">
            <dt className="meta pt-1 text-muted">{v.hours}</dt>
            <dd className="space-y-1">
              {siteConfig.hours.map((h) => (
                <p key={h.id} className="flex justify-between gap-6">
                  <span>{t.hours[h.id]}</span>
                  <span className="tabular">
                    {h.opens}–{h.closes}
                  </span>
                </p>
              ))}
            </dd>
          </div>
          <div className="grid gap-2 border-t border-line py-5 sm:grid-cols-[9rem_1fr]">
            <dt className="meta pt-1 text-muted">{v.address}</dt>
            <dd>
              <address className="not-italic">
                {siteConfig.demo.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="mt-3 text-sm text-muted">{v.mapNote}</p>
            </dd>
          </div>
          <div className="grid gap-2 border-y border-line py-5 sm:grid-cols-[9rem_1fr]">
            <dt className="meta pt-1 text-muted">{v.contact}</dt>
            <dd>
              <a href={`mailto:${siteConfig.demo.email}`} className="link-text">
                {siteConfig.demo.email}
              </a>
            </dd>
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="meta bg-sakura px-1.5 py-0.5 text-ink">{t.demo.badge}</span>
            {t.demo.notice}
          </p>
        </dl>
      </div>

      <section id="book" aria-labelledby="book-title" className="scroll-mt-(--spacing-header) bg-paper py-(--spacing-section)">
        <div className="container-page grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-4">
            <SectionLabel>{`${v.eyebrow} · ${siteConfig.name}`}</SectionLabel>
            <h2 id="book-title" className="mt-6 font-display text-display-m">
              {v.booking.heading}
            </h2>
            <p className="mt-5 max-w-[34ch] text-coffee">{v.booking.intro}</p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ReservationForm labels={v.booking} />
          </div>
        </div>
      </section>

      <section aria-labelledby="contact-title" className="container-page grid gap-y-10 py-(--spacing-section) md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-4">
          <h2 id="contact-title" className="font-display text-display-m">
            {v.contactForm.heading}
          </h2>
          <p className="mt-5 max-w-[34ch] text-muted">{v.contactForm.intro}</p>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <ContactForm labels={{ ...v.contactForm, topics: t.contactTopics }} />
        </div>
      </section>
    </>
  );
}
