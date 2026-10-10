import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { ActionLink } from "@/components/ui/action";

export const metadata: Metadata = {
  title: getDictionary().notFound.metaTitle,
  robots: { index: false },
};

export default function NotFound() {
  const t = getDictionary().notFound;
  return (
    <div className="container-page grid min-h-[70dvh] content-center gap-y-8 py-24 md:grid-cols-12 md:gap-x-6">
      <div className="md:col-span-8">
        <p className="meta text-muted">{t.eyebrow}</p>
        <h1 className="mt-4 font-display text-display-l">{t.title}</h1>
        <p className="mt-5 max-w-[42ch] text-lede">{t.body}</p>
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
          <ActionLink href="/">{t.home}</ActionLink>
          <ActionLink href="/menu" variant="text" arrow={false}>
            {t.menu}
          </ActionLink>
        </div>
      </div>
    </div>
  );
}
