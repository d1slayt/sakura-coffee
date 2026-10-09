import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Buttons and button-like links share one set of styles.
 *  - solid:   the single primary action in a view (ink block, square corners)
 *  - outline: secondary action, hairline frame
 *  - text:    inline action with a drawn underline
 * Tone "inverse" is for dark surfaces.
 */
type Variant = "solid" | "outline" | "text";
type Tone = "default" | "inverse";

const base =
  "group/action inline-flex items-center gap-3 font-sans text-[0.9375rem] font-semibold tracking-[0.01em] transition-colors duration-(--duration-quick) disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, Record<Tone, string>> = {
  solid: {
    default: "min-h-12 bg-ink px-6 text-ivory hover:bg-coffee",
    inverse: "min-h-12 bg-ivory px-6 text-ink hover:bg-sakura",
  },
  outline: {
    default: "min-h-12 border border-line-strong px-6 text-ink hover:border-ink hover:bg-ink hover:text-ivory",
    inverse: "min-h-12 border border-line-inverse px-6 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink",
  },
  text: {
    default: "min-h-11 text-ink",
    inverse: "min-h-11 text-ivory",
  },
};

export function actionClass(variant: Variant = "solid", tone: Tone = "default", className?: string) {
  return cn(base, variants[variant][tone], className);
}

function Arrow({ external }: { external?: boolean }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <Icon
      aria-hidden
      strokeWidth={1.5}
      className="size-4 transition-transform duration-(--duration-base) ease-(--ease-soft) group-hover/action:translate-x-1"
    />
  );
}

interface ActionLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  tone?: Tone;
  className?: string;
  arrow?: boolean;
  children: ReactNode;
}

export function ActionLink({ variant = "solid", tone = "default", className, arrow = true, children, ...props }: ActionLinkProps) {
  return (
    <Link {...props} className={actionClass(variant, tone, className)}>
      <span className={variant === "text" ? "link-draw" : undefined}>{children}</span>
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

interface ActionButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  tone?: Tone;
  arrow?: boolean;
}

export function ActionButton({ variant = "solid", tone = "default", className, arrow = false, children, type = "button", ...props }: ActionButtonProps) {
  return (
    <button type={type} {...props} className={actionClass(variant, tone, className)}>
      <span className={variant === "text" ? "link-draw" : undefined}>{children}</span>
      {arrow ? <Arrow /> : null}
    </button>
  );
}
