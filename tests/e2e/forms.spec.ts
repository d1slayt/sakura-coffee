import { expect, test } from "@playwright/test";

/** First bookable date ≥ `offset` days ahead (brew bar is closed on Mondays). */
function bookableDate(offset: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offset);
  while (d.getUTCDay() === 1) d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

test.describe("brew bar booking", () => {
  test("books a seat end to end and blocks invalid input", async ({ page }, testInfo) => {
    await page.goto("/visit#book");
    const form = page.locator("#book form");

    // Server-side validation: submit with nothing filled in.
    await page.waitForTimeout(2_700); // the form's anti-bot timer
    await form.getByRole("button", { name: "Отправить заявку" }).click();
    await expect(form.getByRole("alert")).toContainText("Проверьте отмеченные поля");
    await expect(form.getByLabel("Имя")).toHaveAttribute("aria-invalid", "true");

    // Pick a date; free seats load from the availability API.
    // Desktop and mobile projects use different days so they don't collide.
    const date = bookableDate(testInfo.project.name === "mobile" ? 21 : 20);
    await form.getByLabel("Дата").fill(date);
    const slot = form.getByRole("radio", { name: "15:00" });
    await expect(slot).toBeEnabled();
    // The radio is visually hidden; people click its label (the time).
    await form.getByText("15:00", { exact: true }).click();
    await expect(slot).toBeChecked();

    await form.getByLabel("Гостей").selectOption("2");
    await form.getByLabel("Имя").fill("Тест Тестов");
    await form.getByLabel("Эл. почта").fill(`e2e-${testInfo.project.name}-${Date.now()}@e2e.example.com`);
    await form.getByRole("button", { name: "Отправить заявку" }).click();

    const success = page.locator("#book").getByRole("status");
    await expect(success).toContainText("Заявка принята");
    await expect(success).toContainText(/SC-[A-Z2-9]{6}/);
  });
});

test.describe("contact form", () => {
  test("validates on the server and saves a message", async ({ page }) => {
    await page.goto("/visit");
    const form = page.locator("section[aria-labelledby='contact-title'] form");
    await page.waitForTimeout(2_700);

    await form.getByLabel("Имя").fill("Мария");
    await form.getByLabel("Эл. почта").fill("not-an-email");
    await form.getByLabel("Сообщение").fill("Коротко");
    await form.getByRole("button", { name: "Отправить" }).click();
    await expect(form.getByText("Введите корректный адрес эл. почты.")).toBeVisible();
    // Values survive a failed submission.
    await expect(form.getByLabel("Имя")).toHaveValue("Мария");

    await form.getByLabel("Эл. почта").fill("maria@e2e.example.com");
    await form.getByLabel("Сообщение").fill("Продвижение сайтов недорого: best-seo.ru");
    await form.getByRole("button", { name: "Отправить" }).click();
    await expect(form.getByText("Без ссылок, пожалуйста: опишите словами.")).toBeVisible();

    await form.getByLabel("Тема").selectOption("EVENTS");
    await form.getByLabel("Сообщение").fill("Хотим провести небольшую дегустацию для команды.");
    await form.getByRole("button", { name: "Отправить" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Сообщение сохранено" })).toBeVisible();
  });
});
