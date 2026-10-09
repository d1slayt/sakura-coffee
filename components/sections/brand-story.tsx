import { getDictionary } from "@/lib/i18n";
import { photos } from "@/lib/images";
import { ActionLink } from "@/components/ui/action";
import { EmphasisText } from "@/components/ui/emphasis";
import { Photo } from "@/components/ui/photo";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";

/** The one dark, type-led block on the page: a pull quote, the story, a single photo. */
export function BrandStory() {
  const t = getDictionary().home.story;
  return (
    <section aria-labelledby="story-title" className="surface-dark bg-ink py-(--spacing-section) text-ivory">
      <div className="container-page grid gap-y-14 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-12">
          <SectionLabel inverse>{t.label}</SectionLabel>
        </div>

        <Reveal className="md:col-span-10 lg:col-span-9">
          <h2 id="story-title" className="font-display text-display-l">
            <EmphasisText value={t.quote} emClassName="text-sakura" />
          </h2>
        </Reveal>

        <div className="md:col-span-5 md:col-start-2 lg:col-span-4 lg:col-start-2">
          <Photo
            photo={photos.storyPourOver}
            ratio="3/4"
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 100vw"
            caption={t.figure}
            captionClassName="text-ivory-dim"
            frameClassName="bg-coffee"
          />
        </div>

        <Reveal className="flex flex-col justify-end md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-8">
          <div className="space-y-5 text-lede text-ivory-dim">
            {t.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <ActionLink href="/about" variant="text" tone="inverse" className="mt-8 self-start">
            {t.link}
          </ActionLink>
        </Reveal>
      </div>
    </section>
  );
}
