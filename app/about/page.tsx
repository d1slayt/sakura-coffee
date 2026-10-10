import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { photos } from "@/lib/images";
import { ActionLink } from "@/components/ui/action";
import { Photo } from "@/components/ui/photo";

const t = getDictionary();

export const metadata: Metadata = {
  title: t.about.metaTitle,
  description: t.about.metaDescription,
  alternates: { canonical: "/about" },
  openGraph: { title: `${t.about.metaTitle} — SakuraCoffee`, description: t.about.metaDescription, url: "/about" },
};

export default function AboutPage() {
  const a = t.about;
  return (
    <>
      <header className="container-page grid gap-y-6 pt-12 pb-12 md:grid-cols-12 md:gap-x-6 md:pt-20 md:pb-16">
        <h1 className="font-display text-display-xl md:col-span-7">{a.title}</h1>
        <p className="self-end text-lede md:col-span-4 md:col-start-9">{a.lede}</p>
      </header>

      <Photo
        photo={photos.aboutKettle}
        sizes="100vw"
        priority
        className="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/8]"
        imageClassName="object-[50%_40%]"
      />

      <div className="container-page py-(--spacing-section)">
        {a.sections.map((section) => (
          <section key={section.heading} className="grid gap-y-4 border-t-2 border-ink py-10 md:grid-cols-12 md:gap-x-6 md:py-14">
            <h2 className="heading md:col-span-4">{section.heading}</h2>
            <div className="space-y-5 text-lede md:col-span-7 md:col-start-6">
              {section.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </section>
        ))}

        <div className="grid gap-y-10 border-t-2 border-ink pt-10 md:grid-cols-12 md:gap-x-6 md:pt-14">
          <div className="md:col-span-4">
            <h2 className="heading">{a.details.heading}</h2>
            <Photo photo={photos.philosophyBeans} ratio="4/5" sizes="(min-width: 768px) 30vw, 100vw" className="mt-8 max-md:hidden" />
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <dl>
              {a.details.items.map((item) => (
                <div key={item.term} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <dt className="font-semibold">{item.term}</dt>
                  <dd className="text-muted">{item.description}</dd>
                </div>
              ))}
            </dl>
            <h2 className="mt-14 font-semibold">{a.room.heading}</h2>
            <p className="mt-2 text-lede">{a.room.body}</p>
          </div>
        </div>
      </div>

      <section aria-labelledby="project-title" className="surface-dark bg-pine py-16 text-paper md:py-24">
        <div className="container-page grid gap-y-6 md:grid-cols-12 md:gap-x-6">
          <h2 id="project-title" className="heading md:col-span-4">
            {a.project.heading}
          </h2>
          <div className="space-y-4 md:col-span-7 md:col-start-6">
            {a.project.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p>
              <a href="https://unsplash.com/license" className="link-text" rel="noopener noreferrer" target="_blank">
                {a.licenseLink}
              </a>
            </p>
            <ActionLink href="/menu" tone="inverse" className="mt-4">
              {a.cta}
            </ActionLink>
          </div>
        </div>
      </section>
    </>
  );
}
