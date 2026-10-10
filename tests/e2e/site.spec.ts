import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe("home", () => {
  test("renders the hero, featured menu and footer", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SakuraCoffee/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Эспрессо, фильтр");
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");

    const featured = page.locator("section[aria-labelledby='featured-title']");
    await expect(featured.getByRole("link", { name: /Флэт уайт/ })).toBeVisible();
    await expect(featured.getByText("Вернётся весной, вместе с цветами.")).toBeVisible();
    await expect(page.locator("footer")).toContainText("Концептуальный бренд");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expectNoHorizontalScroll(page);
  });

  test("every visible image has alt text and loads", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
    });
    // Images inside display:none containers (the other breakpoint's layout) are skipped.
    const images = page.locator("main img").filter({ visible: true });
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute("alt", /.*/);
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), { timeout: 15_000 }).toBe(true);
    }
  });
});

test.describe("menu", () => {
  test("filters by allergen and searches by ingredient", async ({ page }) => {
    await page.goto("/menu");
    const status = page.getByRole("status").filter({ hasText: /позици/ });
    await expect(status).toHaveText("23 позиции");

    await page.getByText("Без молока", { exact: true }).click();
    await expect(page).toHaveURL(/free=milk/);
    await expect(status).toHaveText("10 позиций");

    await page.getByRole("searchbox", { name: "Поиск по меню" }).fill("кунжут");
    await expect(page).toHaveURL(/q=/);
    await expect(status).toHaveText("1 позиция");
    await expect(page.getByRole("heading", { name: "Авокадо на закваске" })).toBeVisible();

    await page.getByRole("link", { name: "Сбросить фильтры" }).first().click();
    await expect(status).toHaveText("23 позиции");
    await expectNoHorizontalScroll(page);
  });

  test("shows an empty state for impossible combinations", async ({ page }) => {
    await page.goto("/menu?q=пицца");
    await expect(page.getByText("Ничего не нашлось.")).toBeVisible();
  });

  test("item page shows ingredients and derived allergens", async ({ page }) => {
    await page.goto("/menu/butter-croissant");
    await expect(page.getByRole("heading", { level: 1, name: "Круассан на сливочном масле" })).toBeVisible();
    await expect(page.getByText("Глютен, Молоко, Яйца")).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("unknown routes render the 404 page", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Такой страницы нет");
  });

  test("main navigation is keyboard reachable", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop navigation");
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Перейти к содержимому" })).toBeFocused();
    await page.getByRole("navigation", { name: "Основная навигация" }).getByRole("link", { name: /Меню/ }).click();
    await expect(page).toHaveURL(/\/menu$/);
  });

  test("mobile menu opens, traps the page and closes with Escape", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile navigation");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Открыть меню" });
    await toggle.click();
    await expect(page.getByRole("button", { name: "Закрыть меню" })).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#main")).toHaveAttribute("inert", "");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Открыть меню" })).toBeFocused();
  });
});
