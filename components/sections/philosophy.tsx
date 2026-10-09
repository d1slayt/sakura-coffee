import { getDictionary } from "@/lib/i18n";
import { photos } from "@/lib/images";
import { EmphasisText } from "@/components/ui/emphasis";
import { Photo } from "@/components/ui/photo";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";

/** Method as a numbered process beside two overlapping photographs. */
export function Philosophy() {
  const t = getDictionary().home.philosophy;
  return (
    <section aria-labelledby="method-title" className="bg-paper py-(--spacing-section)">
      <div className="container-page">
        <SectionLabel>{t.label}</SectionLabel>
        <h2 id="method-title" className="mt-6 max-w-[16ch] font-display text-display-l">
          <EmphasisText value={t.title} emClassName="text-rose-ink" />
        </h2>

        <div className="mt-16 grid gap-y-16 md:mt-24 md:grid-cols-12 md:gap-x-6">
          <div className="relative md:col-span-5">
            <Photo
              photo={photos.philosophyBeans}
              ratio="4/5"
              sizes="(min-width: 768px) 40vw, 100vw"
              caption={t.figureBeans}
              captionClassName="md:max-w-[42%]"
            />
            <Photo
              photo={photos.philosophyEspresso}
              ratio="3/4"
              sizes="(min-width: 768px) 20vw, 60vw"
              caption={t.figureEspresso}
              className="mt-10 ml-auto w-3/5 md:-mt-28 md:w-1/2 md:translate-x-[18%]"
              frameClassName="outline-8 outline-paper"
            />
          </div>

          <ol className="md:col-span-6 md:col-start-7">
            {t.steps.map((step, index) => (
              <Reveal as="li" key={step.title} className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-t border-line-strong py-8 first:pt-6 sm:grid-cols-[5rem_1fr]">
                <span className="font-display text-display-s text-rose-ink italic tabular" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-display-s">{step.title}</h3>
                  <p className="mt-3 max-w-[48ch] text-coffee">{step.body}</p>
                  <p className="meta mt-4 text-muted">{step.meta}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
