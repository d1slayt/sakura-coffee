import { z } from "zod";

export const dietFilters = ["vegan", "vegetarian"] as const;
export const freeFromFilters = ["gluten", "milk", "nuts"] as const;

export type DietFilter = (typeof dietFilters)[number];
export type FreeFromFilter = (typeof freeFromFilters)[number];

/** Accepts `?x=a&x=b`, `?x=a,b` or a single value; drops unknown entries. */
function listOf<T extends string>(allowed: readonly T[]) {
  return z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((value) => {
      const raw = value === undefined ? [] : Array.isArray(value) ? value : [value];
      const parts = raw.flatMap((v) => v.split(",")).map((v) => v.trim().toLowerCase());
      return [...new Set(parts.filter((v): v is T => (allowed as readonly string[]).includes(v)))];
    });
}

const firstString = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => (Array.isArray(v) ? v[0] : v));

/**
 * Menu search parameters. Parsing never throws for user-supplied URLs:
 * invalid values are dropped so a mistyped link still shows the menu.
 */
export const menuQuerySchema = z.object({
  q: firstString.transform((v) => v?.trim().slice(0, 60) || undefined),
  category: firstString.transform((v) =>
    v && /^[a-z0-9-]{1,40}$/.test(v) ? v : undefined,
  ),
  diet: listOf(dietFilters),
  free: listOf(freeFromFilters),
  available: firstString.transform((v) => v === "1" || v === "true"),
});

export type MenuQuery = z.infer<typeof menuQuerySchema>;

export function parseMenuQuery(input: Record<string, string | string[] | undefined>): MenuQuery {
  return menuQuerySchema.parse(input);
}

export function menuQueryFromSearchParams(params: URLSearchParams): MenuQuery {
  const record: Record<string, string | string[]> = {};
  for (const key of new Set(params.keys())) {
    const all = params.getAll(key);
    record[key] = all.length > 1 ? all : all[0];
  }
  return parseMenuQuery(record);
}

export function isEmptyMenuQuery(query: MenuQuery): boolean {
  return (
    !query.q && !query.category && query.diet.length === 0 && query.free.length === 0 && !query.available
  );
}
