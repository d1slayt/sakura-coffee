import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { withBasePath } from "@/lib/static-demo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.shortDescription,
    start_url: withBasePath("/"),
    display: "browser",
    background_color: "#e9e7df",
    theme_color: "#e9e7df",
    icons: [
      { src: withBasePath("/icon.svg"), type: "image/svg+xml", sizes: "any" },
      { src: withBasePath("/apple-icon"), type: "image/png", sizes: "180x180" },
    ],
  };
}
