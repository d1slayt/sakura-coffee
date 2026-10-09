import { getDictionary } from "@/lib/i18n";
import { isStaticDemo, repositoryUrl } from "@/lib/static-demo";

/** Thin notice shown only in the static GitHub Pages build. */
export function DemoBanner() {
  if (!isStaticDemo) return null;
  const t = getDictionary().staticDemo;
  return (
    <div className="bg-ink text-ivory">
      <p className="container-page flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-[0.8125rem]">
        <span className="meta text-sakura">{t.badge}</span>
        <span className="text-ivory-dim">{t.banner}</span>
        {repositoryUrl ? (
          <a href={repositoryUrl} className="link-text text-ivory" target="_blank" rel="noopener noreferrer">
            {t.link}
          </a>
        ) : null}
      </p>
    </div>
  );
}
