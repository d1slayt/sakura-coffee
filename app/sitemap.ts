import type { MetadataRoute } from "next";
import { logServerError } from "@/lib/db/errors";
import { absoluteUrl } from "@/lib/utils";
import { deferToRequest, getMenuItemSlugs } from "@/server/menu";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Generated per request (and cached by getMenuItemSlugs) so builds don't need the database.
  await deferToRequest();

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/menu"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/visit"), changeFrequency: "monthly", priority: 0.8 },
  ];

  try {
    const items = await getMenuItemSlugs();
    return [
      ...pages,
      ...items.map((item) => ({
        url: absoluteUrl(`/menu/${item.slug}`),
        lastModified: item.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];
  } catch (error) {
    // A sitemap without item pages is better than no sitemap.
    logServerError("sitemap", error);
    return pages;
  }
}
