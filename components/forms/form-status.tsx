import { Check } from "lucide-react";
import type { ReactNode } from "react";

export function FormError({ message }: { message: string }) {
  return (
    <p role="alert" className="border-l-2 border-rose-ink bg-sakura/35 px-4 py-3 text-[0.9375rem] text-ink">
      {message}
    </p>
  );
}

export function FormSuccess({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div role="status" className="border-t-2 border-ink pt-6">
      <p className="flex items-center gap-3 font-display text-display-s">
        <Check aria-hidden strokeWidth={1.5} className="size-7 text-sage" />
        {title}
      </p>
      <div className="mt-4 space-y-3 text-coffee">{children}</div>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
