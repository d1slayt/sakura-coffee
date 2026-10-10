"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { menuHref, toggle } from "@/lib/menu-url";
import { cn } from "@/lib/utils";
import {
  dietFilters,
  freeFromFilters,
  type DietFilter,
  type FreeFromFilter,
  type MenuQuery,
} from "@/lib/validations/menu";

interface Labels {
  searchLabel: string;
  searchPlaceholder: string;
  categoryLabel: string;
  allCategories: string;
  filtersLabel: string;
  filters: Record<DietFilter | FreeFromFilter | "available", string>;
  clear: string;
}

interface Props {
  query: MenuQuery;
  categories: { slug: string; name: string }[];
  labels: Labels;
}

/**
 * Search and filters for /menu. The URL is the single source of truth, so
 * results are shareable and rendered on the server. Without JavaScript the
 * controls still work: it's a GET form, and categories are plain links.
 */
export function MenuFilters({ query, categories, labels }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState(query.q ?? "");
  const debounce = useRef<number | undefined>(undefined);

  // Keep the input in sync when the URL changes from elsewhere (back button, clear link).
  const [syncedQ, setSyncedQ] = useState(query.q);
  if (query.q !== syncedQ) {
    setSyncedQ(query.q);
    setText(query.q ?? "");
  }

  useEffect(() => () => window.clearTimeout(debounce.current), []);

  const navigate = (next: Partial<MenuQuery>) => {
    startTransition(() => {
      router.replace(menuHref({ ...query, ...next }), { scroll: false });
    });
  };

  const onSearchChange = (value: string) => {
    setText(value);
    window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => navigate({ q: value.trim() || undefined }), 250);
  };

  const hasFilters =
    Boolean(query.q) || Boolean(query.category) || query.diet.length > 0 || query.free.length > 0 || query.available;

  return (
    <form
      role="search"
      action="/menu"
      method="get"
      aria-busy={isPending}
      onSubmit={(e) => {
        e.preventDefault();
        window.clearTimeout(debounce.current);
        navigate({ q: text.trim() || undefined });
      }}
      className="border-y border-line-strong bg-paper"
    >
      {query.category ? <input type="hidden" name="category" value={query.category} /> : null}

      <div className="flex items-center gap-3 border-b border-line py-3">
        <Search aria-hidden strokeWidth={1.5} className={cn("size-5 shrink-0 text-muted", isPending && "animate-pulse")} />
        <label htmlFor="menu-search" className="sr-only">
          {labels.searchLabel}
        </label>
        <input
          id="menu-search"
          name="q"
          type="search"
          value={text}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={labels.searchPlaceholder}
          autoComplete="off"
          maxLength={60}
          className="min-h-11 w-full bg-transparent font-display text-xl outline-none placeholder:text-muted/80 [&::-webkit-search-cancel-button]:hidden"
        />
        {text ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="inline-flex size-11 shrink-0 items-center justify-center text-muted hover:text-ink"
          >
            <X aria-hidden strokeWidth={1.5} className="size-5" />
            <span className="sr-only">{labels.clear}</span>
          </button>
        ) : null}
        <button type="submit" className="sr-only">
          {labels.searchLabel}
        </button>
      </div>

      <nav aria-label={labels.categoryLabel} className="-mx-(--spacing-gutter) overflow-x-auto scrollbar-none px-(--spacing-gutter) md:mx-0 md:px-0">
        <ul className="flex min-w-max gap-1 py-2">
          <li>
            <CategoryLink href={menuHref({ ...query, category: undefined })} active={!query.category}>
              {labels.allCategories}
            </CategoryLink>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <CategoryLink href={menuHref({ ...query, category: c.slug })} active={query.category === c.slug}>
                {c.name}
              </CategoryLink>
            </li>
          ))}
        </ul>
      </nav>

      <fieldset className="flex flex-wrap items-center gap-x-1 gap-y-1 border-t border-line py-2">
        <legend className="sr-only">{labels.filtersLabel}</legend>
        {dietFilters.map((d) => (
          <FilterToggle
            key={d}
            name="diet"
            value={d}
            checked={query.diet.includes(d)}
            onChange={() => navigate({ diet: toggle(query.diet, d) })}
          >
            {labels.filters[d]}
          </FilterToggle>
        ))}
        <span aria-hidden className="mx-2 h-4 w-px bg-line-strong" />
        {freeFromFilters.map((f) => (
          <FilterToggle
            key={f}
            name="free"
            value={f}
            checked={query.free.includes(f)}
            onChange={() => navigate({ free: toggle(query.free, f) })}
          >
            {labels.filters[f]}
          </FilterToggle>
        ))}
        <span aria-hidden className="mx-2 h-4 w-px bg-line-strong" />
        <FilterToggle name="available" value="1" checked={query.available} onChange={() => navigate({ available: !query.available })}>
          {labels.filters.available}
        </FilterToggle>
        {hasFilters ? (
          <Link href="/menu" scroll={false} className="meta ml-auto inline-flex min-h-11 items-center px-2 text-pine hover:text-ink">
            {labels.clear}
          </Link>
        ) : null}
      </fieldset>
    </form>
  );
}

function CategoryLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center px-3 text-[0.9375rem] font-medium transition-colors duration-(--duration-quick)",
        active ? "bg-pine text-paper" : "text-ink hover:bg-paper-deep",
      )}
    >
      {children}
    </Link>
  );
}

function FilterToggle({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "relative inline-flex min-h-11 cursor-pointer items-center gap-2 px-3 text-sm font-medium transition-colors duration-(--duration-quick) has-focus-visible:outline-2 has-focus-visible:outline-pine",
        checked ? "text-ink" : "text-muted hover:text-ink",
      )}
    >
      <input type="checkbox" name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={cn(
          "inline-block size-3 border transition-colors",
          checked ? "border-pine bg-pine" : "border-line-strong",
        )}
      />
      {children}
    </label>
  );
}
