import Link from "next/link";
import { navigation } from "@/lib/site";
import { cn } from "@/lib/utils";

export type NavItemLabels = Record<(typeof navigation)[number]["key"], string>;

export function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Desktop navigation markup: numbered, small, with the current page underlined.
 * Pure (no hooks), so the server can render it as the static fallback while
 * the client version resolves the current path.
 */
export function NavLinksView({
  label,
  itemLabels,
  pathname,
}: {
  label: string;
  itemLabels: NavItemLabels;
  pathname: string | null;
}) {
  return (
    <nav aria-label={label} className="hidden md:block">
      <ul className="flex items-center gap-8">
        {navigation.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="group flex items-baseline gap-2 py-3 text-[0.9375rem] font-medium"
              >
                <span className={cn("meta text-[0.6875rem] text-muted", active && "text-rose-ink")} aria-hidden>
                  {item.index}
                </span>
                <span className="link-draw" aria-current={active ? "page" : undefined}>
                  {itemLabels[item.key]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
