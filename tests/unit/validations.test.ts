import { describe, expect, it } from "vitest";
import { firstFieldErrors } from "@/lib/validations/common";
import { contactInputSchema } from "@/lib/validations/contact";
import { menuQueryFromSearchParams, parseMenuQuery } from "@/lib/validations/menu";
import { reservationInputSchema } from "@/lib/validations/reservation";

const validReservation = {
  name: "  Анна  ",
  email: " Anna@Example.COM ",
  phone: "",
  date: "2026-10-13",
  time: "10:00",
  partySize: "2",
  note: "",
};

describe("reservationInputSchema", () => {
  it("accepts and normalises a valid request", () => {
    const result = reservationInputSchema.parse(validReservation);
    expect(result).toEqual({
      name: "Анна",
      email: "anna@example.com",
      phone: undefined,
      date: "2026-10-13",
      time: "10:00",
      partySize: 2,
      note: undefined,
    });
  });

  it("drops client-supplied fields such as status", () => {
    const result = reservationInputSchema.parse({ ...validReservation, status: "CONFIRMED" });
    expect(result).not.toHaveProperty("status");
  });

  it.each([
    ["partySize", "0"],
    ["partySize", "5"],
    ["partySize", "2.5"],
    ["partySize", "abc"],
    ["time", "12:30"],
    ["date", "2026-02-30"],
    ["email", "not-an-email"],
    ["name", "A"],
    ["phone", "call me"],
  ])("rejects an invalid %s (%s)", (field, value) => {
    const result = reservationInputSchema.safeParse({ ...validReservation, [field]: value });
    expect(result.success).toBe(false);
    if (!result.success) expect(firstFieldErrors(result.error)).toHaveProperty(field);
  });

  it("returns messages in the site language", () => {
    const result = reservationInputSchema.safeParse({ ...validReservation, partySize: "9" });
    expect(result.success).toBe(false);
    if (!result.success) expect(firstFieldErrors(result.error).partySize).toMatch(/не больше 4/);
  });
});

describe("contactInputSchema", () => {
  it("defaults the topic and rejects short messages", () => {
    expect(contactInputSchema.parse({ name: "Иван", email: "i@example.com", message: "Хочу заказать кофе на мероприятие" }).topic).toBe("GENERAL");
    expect(contactInputSchema.safeParse({ name: "Иван", email: "i@example.com", message: "Привет" }).success).toBe(false);
    expect(contactInputSchema.safeParse({ name: "Иван", email: "i@example.com", topic: "ADMIN", message: "Достаточно длинное сообщение" }).success).toBe(false);
  });
});

describe("menu query parsing", () => {
  it("keeps valid filters and drops unknown ones", () => {
    expect(parseMenuQuery({ q: "  матча ", category: "tea", diet: ["vegan", "keto"], free: "milk,gluten,meat" })).toEqual({
      q: "матча",
      category: "tea",
      diet: ["vegan"],
      free: ["milk", "gluten"],
      available: false,
    });
  });

  it("never throws on hostile input", () => {
    const query = menuQueryFromSearchParams(new URLSearchParams("category=../../etc&q=" + "x".repeat(500) + "&available=yes"));
    expect(query.category).toBeUndefined();
    expect(query.q).toHaveLength(60);
    expect(query.available).toBe(false);
  });
});
