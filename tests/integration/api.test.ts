import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET as getCategories } from "@/app/api/menu/categories/route";
import { GET as getItems } from "@/app/api/menu/items/route";
import { GET as getItem } from "@/app/api/menu/items/[slug]/route";
import { GET as getAvailability } from "@/app/api/reservations/availability/route";
import { GET as getHealth } from "@/app/api/health/route";
import type { MenuItemView } from "@/server/menu";
import { bookableDate, hasDatabase } from "./helpers";

const request = (path: string) =>
  new NextRequest(new URL(path, "http://localhost"), { headers: { "x-forwarded-for": "203.0.113.50" } });
const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe.skipIf(!hasDatabase)("REST API (PostgreSQL)", () => {
  it("GET /api/health reports the database as up", async () => {
    const res = await getHealth();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok", database: "up" });
  });

  it("GET /api/menu/categories lists categories in menu order", async () => {
    const res = await getCategories();
    const body = (await res.json()) as { data: { slug: string; itemCount: number }[] };
    expect(res.status).toBe(200);
    expect(body.data.map((c) => c.slug)).toEqual(["espresso", "filter", "tea", "cold", "bakery", "kitchen"]);
    expect(body.data.every((c) => c.itemCount > 0)).toBe(true);
  });

  it("GET /api/menu/items filters by allergens derived from ingredients", async () => {
    const res = await getItems(request("/api/menu/items?free=milk"));
    const body = (await res.json()) as { data: { count: number; items: MenuItemView[] } };
    expect(res.status).toBe(200);
    expect(body.data.count).toBeGreaterThan(0);
    for (const item of body.data.items) expect(item.allergens).not.toContain("MILK");
  });

  it("GET /api/menu/items searches names and ingredients case-insensitively", async () => {
    const res = await getItems(request(`/api/menu/items?q=${encodeURIComponent("КУНЖУТ")}`));
    const body = (await res.json()) as { data: { items: MenuItemView[] } };
    const slugs = body.data.items.map((i) => i.slug);
    expect(slugs).toContain("black-sesame-cookie");
    expect(slugs).toContain("avocado-on-sourdough");
  });

  it("GET /api/menu/items combines category, diet and availability", async () => {
    const res = await getItems(request("/api/menu/items?category=espresso&diet=vegan&available=1"));
    const body = (await res.json()) as { data: { items: MenuItemView[] } };
    expect(body.data.items.map((i) => i.slug)).toEqual(["espresso"]);
  });

  it("GET /api/menu/items/:slug returns one item, 404s and 400s", async () => {
    const ok = await getItem(request("/api/menu/items/hanami-latte"), params("hanami-latte"));
    const item = ((await ok.json()) as { data: MenuItemView }).data;
    expect(item).toMatchObject({ slug: "hanami-latte", isAvailable: false, isFeatured: true });
    expect(item.ingredients).toContain("Сироп из цветов сакуры");

    expect((await getItem(request("/api/menu/items/nope"), params("nope"))).status).toBe(404);
    expect((await getItem(request("/api/menu/items/DROP%20TABLE"), params("DROP TABLE"))).status).toBe(400);
  });

  it("GET /api/reservations/availability validates the date and reports seats", async () => {
    expect((await getAvailability(request("/api/reservations/availability?date=tomorrow"))).status).toBe(400);

    const res = await getAvailability(request(`/api/reservations/availability?date=${bookableDate(15)}`));
    const body = (await res.json()) as { data: { bookable: boolean; slots: { time: string; seatsLeft: number }[] } };
    expect(res.status).toBe(200);
    expect(body.data.bookable).toBe(true);
    expect(body.data.slots).toHaveLength(6);
  });
});
