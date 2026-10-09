import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { logServerError } from "@/lib/db/errors";
import { siteConfig } from "@/lib/site";
import { absoluteUrl, cn, formatPrice } from "@/lib/utils";
import { getMenuItemBySlug } from "@/server/menu";
import { DietaryTags, IngredientFacts } from "@/components/menu/item-facts";
import { JsonLd } from "@/components/json-ld";
import { ActionLink } from "@/components/ui/action";
import { BlossomMark } from "@/components/ui/blossom-mark";
import { DataBoundary } from "@/components/ui/data-boundary";

const t = getDictionary();
const SLUG = /^[a-z0-9-]{1,80}$/;

export async function generateMetadata(props: PageProps<"/menu/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  if (!SLUG.test(slug)) return { title: t.menu.metaTitle };
  try {
    const item = await getMenuItemBySlug(slug);
    if (!item) return { title: t.menu.metaTitle, robots: { index: false } };
    return {
      title: item.name,
      description: item.description,
      alternates: { canonical: `/menu/${item.slug}` },
      openGraph: {
        title: `${item.name} — SakuraCoffee`,
        description: item.description,
        url: `/menu/${item.slug}`,
        images: item.imageUrl ? [{ url: `${item.imageUrl}?auto=format&fit=crop&w=1200&h=630&q=75`, width: 1200, height: 630, alt: item.imageAlt ?? item.name }] : undefined,
      },
    };
  } catch (error) {
    // Metadata must never take the page down; the page itself shows the error state.
    logServerError("menu/[slug] generateMetadata", error);
    return { title: t.menu.metaTitle };
  }
}

async function MenuItemDetail({ params }: { params: PageProps<"/menu/[slug]">["params"] }) {
  const { slug } = await params;
  if (!SLUG.test(slug)) notFound();
  const item = await getMenuItemBySlug(slug);
  if (!item) notFound();

  return (
    <article className="grid gap-y-12 md:grid-cols-12 md:gap-x-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MenuItem",
          name: item.name,
          description: item.description,
          url: absoluteUrl(`/menu/${item.slug}`),
          ...(item.isAvailable
            ? { offers: { "@type": "Offer", price: (item.priceCents / 100).toFixed(2), priceCurrency: siteConfig.currency } }
            : {}),
        }}
      />
      <div className="md:col-span-6 lg:col-span-5">
        <div className="relative aspect-[4/5] overflow-hidden bg-paper">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.imageAlt ?? ""}
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              quality={80}
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          ) : (
            <div className={cn("flex h-full flex-col items-center justify-center gap-6 p-8 text-center", item.isAvailable ? "bg-paper" : "bg-sakura")}>
              <BlossomMark className="size-24 text-rose-ink" />
              <p className="font-display text-display-s italic">{item.name}</p>
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
        <p className="meta text-muted">
          <Link href={`/menu?category=${item.category.slug}`} className="link-draw">
            {item.category.name}
          </Link>
        </p>
        <h1 className="mt-4 font-display text-display-l">{item.name}</h1>
        <DietaryTags tags={item.dietaryTags} className="mt-4" />
        <p className="mt-6 max-w-[48ch] text-lede text-coffee">{item.description}</p>

        <div className="mt-8 flex items-baseline justify-between border-y border-line py-5">
          <span className="meta text-muted">{item.brewNote ?? item.category.name}</span>
          {item.isAvailable ? (
            <span className="text-2xl font-semibold tabular">{formatPrice(item.priceCents)}</span>
          ) : (
            <span className="meta inline-flex items-center gap-2 text-rose-ink">
              <BlossomMark className="size-3.5" />
              {item.availabilityNote ?? t.menu.unavailable}
            </span>
          )}
        </div>

        <IngredientFacts item={item} className="mt-6" />
        <p className="mt-6 text-sm text-muted">{t.menu.allergenNote}</p>

        <ActionLink href="/menu" variant="text" className="mt-10" arrow={false}>
          <span className="inline-flex items-center gap-2">
            <ArrowLeft aria-hidden className="size-4" strokeWidth={1.5} />
            {t.menu.backToMenu}
          </span>
        </ActionLink>
      </div>
    </article>
  );
}

function DetailSkeleton() {
  return (
    <div aria-hidden className="grid gap-y-12 md:grid-cols-12 md:gap-x-6">
      <div className="aspect-[4/5] bg-paper md:col-span-6 lg:col-span-5" />
      <div className="space-y-4 md:col-span-6 lg:col-start-7">
        <div className="h-4 w-24 bg-paper" />
        <div className="h-16 w-3/4 bg-paper" />
        <div className="h-24 bg-paper" />
      </div>
    </div>
  );
}

export default function MenuItemPage(props: PageProps<"/menu/[slug]">) {
  return (
    <div className="container-page pt-12 pb-(--spacing-section) md:pt-20">
      <DataBoundary title={t.error.dataTitle} body={t.error.dataBody} retryLabel={t.error.retry}>
        <Suspense fallback={<DetailSkeleton />}>
          <MenuItemDetail params={props.params} />
        </Suspense>
      </DataBoundary>
    </div>
  );
}
