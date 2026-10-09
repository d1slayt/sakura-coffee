// Responsive audit across real device profiles in Chromium and WebKit (Safari).
// Usage: node scripts/responsive-audit.mjs [baseUrl] [outDir]
// Reports horizontal overflow, elements sticking out of the viewport, and
// images that failed to load or collapsed to zero size. Saves a full-page
// screenshot per device/page for visual review.
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, devices, webkit } from "@playwright/test";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const outDir = process.argv[3] ?? "audit";
const pages = ["/", "/menu/", "/menu/flat-white/", "/about/", "/visit/"];

const profiles = [
  { name: "galaxy-fold-280", engine: chromium, use: { viewport: { width: 280, height: 653 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true } },
  { name: "iphone-se-320", engine: webkit, use: { viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  { name: "iphone-13-390", engine: webkit, use: devices["iPhone 13"] },
  { name: "iphone-15-pro-max-430", engine: webkit, use: { viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true } },
  { name: "android-360", engine: chromium, use: devices["Galaxy S9+"] },
  { name: "pixel-7-412", engine: chromium, use: devices["Pixel 7"] },
  { name: "phone-landscape-844", engine: webkit, use: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true } },
  { name: "ipad-mini-768", engine: webkit, use: devices["iPad Mini"] },
  { name: "ipad-landscape-1024", engine: webkit, use: { viewport: { width: 1024, height: 768 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  { name: "laptop-1280", engine: chromium, use: { viewport: { width: 1280, height: 720 } } },
  { name: "desktop-1920", engine: chromium, use: { viewport: { width: 1920, height: 1080 } } },
  { name: "wide-2560", engine: chromium, use: { viewport: { width: 2560, height: 1440 } } },
];

await mkdir(outDir, { recursive: true });
const report = [];
const browsers = new Map();

for (const profile of profiles) {
  if (!browsers.has(profile.engine)) browsers.set(profile.engine, await profile.engine.launch());
  const context = await browsers.get(profile.engine).newContext({ ...profile.use, locale: "ru-RU" });
  const page = await context.newPage();
  for (const path of pages) {
    await page.goto(base + path, { waitUntil: "load" });
    // Scroll through so lazy images and scroll-triggered reveals run.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(600);

    const result = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflow = document.documentElement.scrollWidth - vw;
      const sticking = [];
      for (const el of document.querySelectorAll("body *")) {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        if (el.closest("[aria-hidden='true'].absolute") || el.closest(".scrollbar-none")) continue;
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.right > vw + 1 || r.left < -1)) {
          sticking.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 3).join(".")} [${Math.round(r.left)}..${Math.round(r.right)}]`);
        }
      }
      const images = [...document.querySelectorAll("main img")].filter((img) => img.offsetParent !== null);
      const broken = images
        .filter((img) => !img.complete || img.naturalWidth === 0 || img.getBoundingClientRect().height < 10)
        .map((img) => `${img.alt.slice(0, 40)} (${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)}, natural ${img.naturalWidth})`);
      return { overflow, sticking: sticking.slice(0, 6), broken, images: images.length };
    });

    const slug = path === "/" ? "home" : path.replace(/\//g, "-").replace(/^-|-$/g, "");
    // CSS-pixel scale keeps very long pages under the 32 767 px screenshot limit.
    await page.screenshot({ path: `${outDir}/${profile.name}__${slug}.png`, fullPage: true, scale: "css" });
    const ok = result.overflow <= 0 && result.sticking.length === 0 && result.broken.length === 0;
    report.push({ device: profile.name, page: path, ok, ...result });
    console.log(`${ok ? "OK  " : "FAIL"} ${profile.name.padEnd(22)} ${path.padEnd(20)} overflow=${result.overflow} images=${result.images} broken=${result.broken.length} sticking=${result.sticking.length}`);
    for (const s of result.sticking) console.log(`       sticks out: ${s}`);
    for (const b of result.broken) console.log(`       broken img: ${b}`);
  }
  await context.close();
}

for (const browser of browsers.values()) await browser.close();
await writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2));
const failures = report.filter((r) => !r.ok).length;
console.log(`\n${report.length - failures}/${report.length} checks passed.`);
process.exitCode = failures ? 1 : 0;
