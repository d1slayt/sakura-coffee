import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { photos } from "@/lib/images";
import { ActionLink } from "@/components/ui/action";
import { EmphasisText } from "@/components/ui/emphasis";
import { Photo } from "@/components/ui/photo";
import { Reveal } from "@/components/ui/reveal";

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
      <header className="container-page grid gap-y-8 pt-12 pb-16 md:grid-cols-12 md:gap-x-6 md:pt-20 md:pb-24">
        <p className="meta text-muted md:col-span-12">{a.eyebrow}</p>
        <h1 className="font-display text-display-xl md:col-span-8">
          <EmphasisText value={a.title} emClassName="text-rose-ink" />
        </h1>
        <p className="self-end text-lede text-coffee md:col-span-4">{a.lede}</p>
      </header>

      <div className="container-page">
        <Photo
          photo={photos.aboutKettle}
          ratio="21/9"
          sizes="(min-width: 1440px) 1344px, 100vw"
          priority
          caption={a.figures.kettle}
          frameClassName="max-md:aspect-[4/5]!"
          imageClassName="object-[50%_40%]"
        />
      </div>

      <div className="container-page py-(--spacing-section)">
        {a.sections.map((section, i) => (
          <Reveal key={section.heading} className="grid gap-y-5 border-t border-line py-12 md:grid-cols-12 md:gap-x-6 md:py-16">
            <h2 className="font-display text-display-m md:col-span-4">
              <span className="meta mb-3 block text-muted tabular">{String(i + 1).padStart(2, "0")}</span>
              {section.heading}
            </h2>
            <div className="space-y-5 text-lede text-coffee md:col-span-6 md:col-start-6">
              {section.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>
        ))}

        <div className="grid gap-y-12 border-t border-line pt-12 md:grid-cols-12 md:gap-x-6 md:pt-16">
          <div className="md:col-span-4">
            <Photo
              photo={photos.storyBlossom}
              ratio="4/5"
              sizes="(min-width: 768px) 30vw, 100vw"
              caption={a.figures.blossom}
              imageClassName="object-[30%_50%]"
            />
          </div>
          <div className="md:col-span-6 md:col-start-6">
            <h2 className="font-display text-display-m">{a.details.heading}</h2>
            <dl className="mt-8">
              {a.details.items.map((item) => (
                <div key={item.term} className="grid gap-1 border-t border-line py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <dt className="meta pt-1 text-muted">{item.term}</dt>
                  <dd className="text-coffee">{item.description}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-14">
              <h2 className="font-display text-display-s">{a.room.heading}</h2>
              <p className="mt-4 text-coffee">{a.room.body}</p>
            </div>
          </div>
        </div>
      </div>

      <section aria-labelledby="project-title" className="bg-paper py-20 md:py-28">
        <div className="container-page grid gap-y-6 md:grid-cols-12 md:gap-x-6">
          <h2 id="project-title" className="font-display text-display-s md:col-span-4">
            {a.project.heading}
          </h2>
          <div className="space-y-4 text-coffee md:col-span-6 md:col-start-6">
            {a.project.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p>
              <a href="https://unsplash.com/license" className="link-text" rel="noopener noreferrer" target="_blank">
                {a.licenseLink}
              </a>
            </p>
            <ActionLink href="/menu" variant="text" className="pt-4">
              {a.cta}
            </ActionLink>
          </div>
        </div>
      </section>
    </>
  );
}
