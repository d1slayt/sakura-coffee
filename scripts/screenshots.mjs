// Captures README screenshots from a running instance of the site.
// Usage: npm run dev (or npm run start), then: npm run screenshots
// Base URL can be overridden with SCREENSHOT_BASE_URL.
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";
const out = "docs/screenshots";

/** Scroll through the page so scroll-triggered reveals have run. */
async function warmUp(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
}

async function shotAt(page, selector, file, offset = 96) {
  await page.evaluate(
    ([sel, off]) => {
      const el = document.querySelector(sel);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - off);
    },
    [selector, offset],
  );
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/${file}` });
  console.log(`saved ${file}`);
}

await mkdir(out, { recursive: true });
const browser = await chromium.launch();

// Desktop
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: "ru-RU" });
await desktop.goto(base, { waitUntil: "networkidle" });
await warmUp(desktop);
await desktop.screenshot({ path: `${out}/home-hero.png` });
console.log("saved home-hero.png");
await shotAt(desktop, "#story-title", "home-story.png", 160);
await shotAt(desktop, "#featured-title", "home-menu.png", 140);
await shotAt(desktop, "#method-title", "home-method.png", 140);
await shotAt(desktop, "#room-title", "home-room.png", 140);

await desktop.goto(`${base}/menu?free=milk`, { waitUntil: "networkidle" });
await warmUp(desktop);
await shotAt(desktop, "form[role=search]", "menu.png", 260);

await desktop.goto(`${base}/visit`, { waitUntil: "networkidle" });
await warmUp(desktop);
await shotAt(desktop, "#book", "booking.png", 72);

// Mobile
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: "ru-RU",
});
await mobile.goto(base, { waitUntil: "networkidle" });
await warmUp(mobile);
await mobile.screenshot({ path: `${out}/mobile-home.png` });
console.log("saved mobile-home.png");
await mobile.getByRole("button", { name: "Открыть меню" }).click();
await mobile.waitForTimeout(600);
await mobile.screenshot({ path: `${out}/mobile-nav.png` });
console.log("saved mobile-nav.png");

await browser.close();
