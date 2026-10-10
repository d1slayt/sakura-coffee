import { FeaturedMenu } from "@/components/sections/featured-menu";
import { Hero } from "@/components/sections/hero";
import { Room } from "@/components/sections/room";
import { VisitSummary } from "@/components/sections/visit-summary";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CafeOrCoffeeShop",
          name: siteConfig.name,
          url: absoluteUrl("/"),
          description: siteConfig.shortDescription,
          hasMenu: absoluteUrl("/menu"),
          servesCuisine: ["Кофе", "Японский чай", "Выпечка"],
          inLanguage: siteConfig.locale,
          // Address, geo coordinates, phone and ratings are intentionally omitted:
          // this is a concept brand and those details would be fabricated.
        }}
      />
      <Hero />
      <FeaturedMenu />
      <Room />
      <VisitSummary />
    </>
  );
}
