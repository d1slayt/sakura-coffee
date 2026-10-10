import { describe, expect, it } from "vitest";
import { firstFieldErrors } from "@/lib/validations/common";
import { contactInputSchema } from "@/lib/validations/contact";
import { reservationInputSchema } from "@/lib/validations/reservation";
import { containsLink, normalizePhone } from "@/lib/validations/text";

const reservation = {
  name: "Анна",
  email: "anna@example.com",
  phone: "",
  date: "2026-10-13",
  time: "10:00",
  partySize: "2",
  note: "",
};

const contact = { name: "Иван", email: "ivan@example.com", topic: "GENERAL", message: "Хотим заказать кофе на мероприятие." };

function reservationError(field: string, value: string) {
  const result = reservationInputSchema.safeParse({ ...reservation, [field]: value });
  return result.success ? undefined : (firstFieldErrors(result.error) as Record<string, string>)[field];
}

function contactError(field: string, value: string) {
  const result = contactInputSchema.safeParse({ ...contact, [field]: value });
  return result.success ? undefined : (firstFieldErrors(result.error) as Record<string, string>)[field];
}

describe("names", () => {
  it.each(["Анна", "Анна-Мария", "Jean-Luc", "O'Brien", "Иван Петров"])("accepts %s", (name) => {
    expect(reservationError("name", name)).toBeUndefined();
  });

  it.each(["Анна123", "http://spam.ru", "spam.com", "<b>Анна</b>", "Ааааааа", "Один Два Три Четыре Пять", "🤖🤖"])("rejects %s", (name) => {
    expect(reservationError("name", name)).toBeDefined();
  });

  it("strips invisible characters and extra spaces", () => {
    const result = reservationInputSchema.parse({ ...reservation, name: " Ан​на ‮  Петрова " });
    expect(result.name).toBe("Анна Петрова");
  });
});

describe("emails", () => {
  it("rejects reserved test domains and disposable inboxes", () => {
    expect(reservationError("email", "me@site.test")).toMatch(/не дойдёт/);
    expect(reservationError("email", "me@mailinator.com")).toMatch(/Одноразовую/);
  });

  it("suggests the intended domain for common typos", () => {
    expect(reservationError("email", "Anna@GMIAL.com")).toBe("Похоже на опечатку. Может быть, anna@gmail.com?");
    expect(reservationError("email", "anna@yandex.ry")).toMatch(/anna@yandex\.ru/);
  });
});

describe("phones", () => {
  it.each([
    ["+7 (900) 512-08-34", "+7 900 512-08-34"],
    ["8 900 512 08 34", "+7 900 512-08-34"],
    ["79005120834", "+7 900 512-08-34"],
    ["+7 495 640-17-29", "+7 495 640-17-29"],
    ["+44 20 7946 0958", "+442079460958"],
  ])("normalises %s", (input, stored) => {
    expect(reservationInputSchema.parse({ ...reservation, phone: input }).phone).toBe(stored);
  });

  it.each(["123", "позвоните мне", "+7 000 123-45-67", "8 900 000 00 00", "+7 900 123-45-6", "89001234567890", "900 123-45-67", "+8 900 123-45-67", "+7 999 999-99-99", "+7 900 012-34-56", "+7 900 123-45-67"])(
    "rejects %s",
    (phone) => {
      expect(reservationError("phone", phone)).toMatch(/\+7 900 123-45-67/);
    },
  );

  it("treats an empty phone as not given", () => {
    expect(normalizePhone("")).toBeNull();
    expect(reservationInputSchema.parse({ ...reservation, phone: "   " }).phone).toBeUndefined();
  });
});

describe("free text", () => {
  it("allows a normal note and message", () => {
    expect(reservationError("note", "Будем с ребёнком, нужен детский стул.")).toBeUndefined();
    expect(contactError("message", "Хотим провести дегустацию на 12 человек в субботу.\n\nСпасибо!")).toBeUndefined();
  });

  it.each([
    ["https://cheap-seo.example.com", /ссылок/],
    ["Заходите на мой сайт best-coffee.ru", /ссылок/],
    ["Пишите в t.me/spamchannel", /ссылок/],
    ["Сайт: кофе.рф", /ссылок/],
    ["<script>alert(1)</script> привет всем", /HTML/],
    ["аааааааааааааааа", /случайный набор/],
    ["СРОЧНО КУПИТЕ НАШИ УСЛУГИ ДЁШЕВО", /случайный набор/],
    ["1234567890 1234567890", /случайный набор/],
  ])("rejects %s", (message, error) => {
    expect(contactError("message", message)).toMatch(error);
  });

  it("collapses blank lines and keeps paragraphs", () => {
    const result = contactInputSchema.parse({ ...contact, message: "Первая строка.\n\n\n\n\nВторая строка тут." });
    expect(result.message).toBe("Первая строка.\n\nВторая строка тут.");
  });

  it("does not mistake ordinary punctuation for a link", () => {
    expect(containsLink("Кофе.Мы придём в 10.30, т.е. утром.")).toBe(false);
  });
});
