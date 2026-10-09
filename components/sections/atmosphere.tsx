import { getDictionary } from "@/lib/i18n";
import { photos } from "@/lib/images";
import { EmphasisText } from "@/components/ui/emphasis";
import { Photo } from "@/components/ui/photo";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";

/** Offset collage: three photographs of different sizes on a staggered grid. */
export function Atmosphere() {
  const t = getDictionary().home.atmosphere;
  return (
    <section aria-labelledby="room-title" className="container-page py-(--spacing-section)">
      <div className="grid gap-y-14 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-5 md:pt-10">
          <SectionLabel>{t.label}</SectionLabel>
          <h2 id="room-title" className="mt-6 font-display text-display-m">
            <EmphasisText value={t.title} />
          </h2>
          <p className="mt-5 max-w-[34ch] text-lede text-coffee">{t.body}</p>
        </div>

        <Reveal className="md:col-span-7">
          <Photo
            photo={photos.atmosphereTable}
            ratio="3/2"
            sizes="(min-width: 1440px) 820px, (min-width: 768px) 58vw, 100vw"
            caption={t.captions.table}
          />
        </Reveal>

        <Reveal className="md:col-span-4 md:col-start-2 md:-mt-10">
          <Photo
            photo={photos.atmosphereWindow}
            ratio="4/5"
            sizes="(min-width: 768px) 32vw, 100vw"
            caption={t.captions.window}
            verticalCaption={t.captions.windowVertical}
          />
        </Reveal>

        <Reveal className="md:col-span-5 md:col-start-7 md:mt-40" delay={0.1}>
          <Photo
            photo={photos.atmosphereBar}
            ratio="16/10"
            sizes="(min-width: 768px) 40vw, 100vw"
            caption={t.captions.bar}
          />
          <p className="meta mt-10 text-muted">{t.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
