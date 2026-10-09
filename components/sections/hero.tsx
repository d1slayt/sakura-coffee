import { getDictionary } from "@/lib/i18n";
import { photos } from "@/lib/images";
import { ActionLink } from "@/components/ui/action";
import { BlossomMark } from "@/components/ui/blossom-mark";
import { EmphasisText } from "@/components/ui/emphasis";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/utils";

const STAGGER = ["", "pl-[0.6em]", "pl-[1.2em]"];

/**
 * Editorial split: a staggered two-line headline on seven columns, a tall
 * photograph with a vertical method caption on five, and an "on the bar
 * today" strip that closes the first screen like a magazine contents line.
 */
export function Hero() {
  const t = getDictionary().home.hero;

  return (
    <section aria-labelledby="hero-title" className="container-page pt-6 md:pt-10">
      <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
        <div className="flex flex-col md:col-span-7 md:pr-6">
          <div className="meta flex items-center justify-between gap-4 border-b border-line pb-3 text-muted">
            <span>{t.eyebrow}</span>
            <span className="tabular">{t.issue}</span>
          </div>

          <h1 id="hero-title" className="mt-10 font-display text-display-xl md:mt-16 lg:mt-24">
            {/* Three staggered lines, like a column of type stepping down the page. */}
            {t.title.map((line, i) => (
              <span key={i} className={cn("block", STAGGER[i])}>
                <EmphasisText value={line} emClassName="text-coffee" />
                {i === t.title.length - 1 ? (
                  // The one sakura detail on the first screen, set like a superscript after the full stop.
                  <BlossomMark className="ml-[0.1em] inline-block size-[0.3em] align-[0.55em] text-rose" />
                ) : null}
              </span>
            ))}
          </h1>

          <div className="mt-10 flex flex-col gap-8 md:mt-auto md:pt-14 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-[36ch] text-lede text-coffee">{t.intro}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <ActionLink href="/menu">{t.primaryCta}</ActionLink>
              <ActionLink href="/visit#book" variant="text" arrow={false}>
                {t.secondaryCta}
              </ActionLink>
            </div>
          </div>
        </div>

        <div className="md:col-span-5">
          <Photo
            photo={photos.heroPour}
            ratio="4/5"
            sizes="(min-width: 1440px) 560px, (min-width: 768px) 40vw, 100vw"
            priority
            verticalCaption={t.verticalCaption}
            caption={t.figure}
            imageClassName="object-[50%_60%]"
          />
        </div>
      </div>

      <div className="mt-12 grid gap-6 border-t border-line py-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-[minmax(0,14rem)_repeat(3,minmax(0,1fr))]">
        <p className="meta flex items-center gap-2 text-ink sm:col-span-2 lg:col-span-1">
          <BlossomMark className="size-4 text-rose" />
          {t.onBarTitle}
        </p>
        {t.onBar.map((item) => (
          <p key={item.label} className="flex flex-col gap-1">
            <span className="meta text-muted">{item.label}</span>
            <span className="font-display text-xl">{item.value}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
