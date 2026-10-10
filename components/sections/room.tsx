import { getDictionary } from "@/lib/i18n";
import { photos } from "@/lib/images";
import { ActionLink } from "@/components/ui/action";
import { Photo } from "@/components/ui/photo";

/** A wide photograph of the bar, then the room described as plain facts. */
export function Room() {
  const t = getDictionary().home.room;
  return (
    <section aria-labelledby="room-title" className="pb-(--spacing-section)">
      <Photo
        photo={photos.atmosphereBar}
        sizes="100vw"
        className="aspect-[4/3] sm:aspect-[2/1] lg:aspect-[21/8]"
        imageClassName="object-[50%_55%]"
      />

      <div className="container-page mt-3">
        <p className="meta font-medium text-muted">{t.photoNote}</p>
      </div>

      <div className="container-page mt-12 grid gap-y-10 md:mt-16 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-5">
          <h2 id="room-title" className="heading">
            {t.title}
          </h2>
          <p className="mt-5 max-w-[40ch] text-lede">{t.body}</p>
          <p className="mt-5 max-w-[44ch] text-muted">{t.name}</p>
          <ActionLink href="/about" variant="text" className="mt-5">
            {t.link}
          </ActionLink>
        </div>

        <dl className="border-t-2 border-ink lg:col-span-6 lg:col-start-7">
          {t.facts.map((fact) => (
            <div key={fact.term} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
              <dt className="font-semibold">{fact.term}</dt>
              <dd className="text-muted">{fact.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
