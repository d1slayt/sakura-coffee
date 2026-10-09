"use client";

import { usePathname } from "next/navigation";
import { NavLinksView, type NavItemLabels } from "./nav-links-view";

/** Navigation with the current page marked. Render inside <Suspense> (pathname is runtime data). */
export function NavLinks({ label, itemLabels }: { label: string; itemLabels: NavItemLabels }) {
  const pathname = usePathname();
  return <NavLinksView label={label} itemLabels={itemLabels} pathname={pathname} />;
}
