// Turns a checkout into the static GitHub Pages variant of the site.
// It MODIFIES FILES IN PLACE, so it only runs in CI (or with --force on a
// throwaway copy). The real, database-backed app is what lives in git.
//
// What changes:
//  - app/api/* is removed (no server on GitHub Pages);
//  - server/menu.ts and server/actions.ts are replaced by demo/ versions with
//    the same exports (bundled seed data, browser-side validation);
//  - /menu filters in the browser; /menu/[slug] lists its static params.
import { appendFile, cp, rename, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

if (!process.env.CI && !process.argv.includes("--force")) {
  console.error("prepare-pages rewrites source files. Run it in CI or pass --force on a copy.");
  process.exit(1);
}

const copies = [
  ["demo/server/menu.ts", "server/menu.ts"],
  ["demo/server/actions.ts", "server/actions.ts"],
  ["demo/app/menu/page.tsx", "app/menu/page.tsx"],
];

await rm("app/api", { recursive: true, force: true });
for (const [from, to] of copies) await cp(from, to);
if (existsSync("app/menu/[slug]/page.tsx") && !existsSync("app/menu/[slug]/item-page.tsx")) {
  await rename("app/menu/[slug]/page.tsx", "app/menu/[slug]/item-page.tsx");
}
await cp("demo/app/menu/[slug]/page.tsx", "app/menu/[slug]/page.tsx");
// Metadata routes must be marked static for `output: "export"`. (The server
// build uses Cache Components, where this segment option isn't allowed.)
for (const file of ["app/apple-icon.tsx", "app/opengraph-image.tsx", "app/sitemap.ts", "app/robots.ts", "app/manifest.ts"]) {
  await appendFile(file, '\nexport const dynamic = "force-static";\n');
}
// Tests and the demo sources reference modules that no longer exist in this variant.
await rm("tests", { recursive: true, force: true });
await rm("demo", { recursive: true, force: true });
await writeFile(".pages-variant", "static\n");

console.log("Prepared static GitHub Pages variant.");
