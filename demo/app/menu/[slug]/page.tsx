// STATIC DEMO OVERRIDE — app/menu/[slug]/page.tsx is moved to item-page.tsx and
// this file takes its place, adding the list of pages to pre-render.
import { staticItems } from "@/lib/static-catalog";

export { default, generateMetadata } from "./item-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return staticItems.map((item) => ({ slug: item.slug }));
}
