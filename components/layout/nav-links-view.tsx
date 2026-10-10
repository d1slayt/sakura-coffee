import Link from "next/link";
import { navigation } from "@/lib/site";
import { cn } from "@/lib/utils";

export type NavItemLabels = Record<(typeof navigation)[number]["key"], string>;

export function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Desktop navigation markup: plain links, the current page underlined.
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
                className={cn("link-draw block py-3 text-[0.9375rem] font-semibold", active && "text-pine")}
              >
                {itemLabels[item.key]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
