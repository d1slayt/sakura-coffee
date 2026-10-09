import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/**
 * STATIC_EXPORT=1 builds the static GitHub Pages demo (after
 * scripts/prepare-pages.mjs). Everything else is the full server app.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = isStaticExport ? (process.env.PAGES_BASE_PATH ?? "") : "";

const shared: NextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: isStaticExport ? "1" : "",
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const serverApp: NextConfig = {
  ...shared,
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
    remotePatterns: [new URL("https://images.unsplash.com/photo-**")],
    maximumRedirects: 0,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

const staticDemo: NextConfig = {
  ...shared,
  output: "export",
  basePath,
  trailingSlash: true,
  // No image optimizer on a static host: Unsplash's CDN resizes via a custom loader.
  images: { loader: "custom", loaderFile: "./lib/unsplash-loader.ts", qualities: [70, 80] },
  typescript: { tsconfigPath: "tsconfig.pages.json" },
};

export default isStaticExport ? staticDemo : serverApp;
