import type { MenuQuery } from "./validations/menu";

/** Serialises a menu query to a stable `/menu?…` URL (shared by links and the filter form). */
export function menuHref(query: Partial<MenuQuery>): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  for (const d of query.diet ?? []) params.append("diet", d);
  for (const f of query.free ?? []) params.append("free", f);
  if (query.available) params.set("available", "1");
  const qs = params.toString();
  return qs ? `/menu?${qs}` : "/menu";
}

export function toggle<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
