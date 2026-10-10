"use client";

import { getDictionary } from "@/lib/i18n";
import { ActionButton } from "@/components/ui/action";

/** Route-level error boundary. Never shows error details to visitors. */
export default function RouteError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = getDictionary().error;
  return (
    <div className="container-page grid min-h-[60dvh] content-center py-24">
      <h1 className="font-display text-display-l">{t.title}</h1>
      <p className="mt-4 max-w-[42ch] text-lede text-ink">{t.body}</p>
      <div className="mt-8">
        <ActionButton onClick={() => retry()}>{t.retry}</ActionButton>
      </div>
    </div>
  );
}
