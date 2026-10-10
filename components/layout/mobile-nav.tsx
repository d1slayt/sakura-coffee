"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { navigation } from "@/lib/site";
import { isActivePath } from "./nav-links-view";

interface Labels {
  open: string;
  close: string;
  nav: string;
  cta: string;
  items: Record<(typeof navigation)[number]["key"], string>;
}

/**
 * Mobile navigation as a disclosure: a button toggles a full-width panel
 * under the header. Escape closes it and returns focus to the toggle; the
 * page behind is made inert so keyboard focus stays in the panel.
 */
export function MobileNav({ labels }: { labels: Labels }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Close when the route changes (link clicked). Adjusting state during render
  // in response to a prop change is the React-recommended pattern here.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("main");
    const footer = document.querySelector("footer");
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    document.documentElement.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) close(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close() : setOpen(true))}
        className="inline-flex size-11 items-center justify-center"
      >
        <span className="sr-only">{open ? labels.close : labels.open}</span>
        {open ? <X aria-hidden strokeWidth={1.5} className="size-6" /> : <Menu aria-hidden strokeWidth={1.5} className="size-6" />}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="surface-dark fixed inset-x-0 top-(--spacing-header) bottom-0 z-40 flex flex-col overflow-y-auto bg-pine px-(--spacing-gutter) pb-8 text-paper"
          >
            <nav aria-label={labels.nav}>
              <ul>
                {navigation.map((item, i) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href} className="border-b border-line-inverse">
                      <Link
                        ref={i === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className="flex items-center justify-between gap-4 py-5"
                      >
                        <span className="font-display text-[2.5rem] leading-none">{labels.items[item.key]}</span>
                        {active ? <span aria-hidden className="size-2 bg-pink" /> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="mt-auto pt-10">
              <Link
                href="/visit#book"
                className="mt-8 flex min-h-12 items-center justify-center bg-paper px-6 font-semibold text-ink"
              >
                {labels.cta}
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
