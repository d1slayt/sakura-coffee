"use client";

import { useEffect, useState } from "react";
import { openStateAt, type OpenState } from "@/lib/opening";
import { cn } from "@/lib/utils";

interface Labels {
  openNow: string;
  closedNow: string;
  until: string;
  opensAt: string;
  today: string;
  tomorrow: string;
}

/**
 * "Open now · until 17:00". Computed in the browser after mount (in the
 * shop's time zone, not the visitor's) so the static page shell stays
 * cacheable and there's no hydration mismatch.
 */
export function OpenStatus({ labels, className }: { labels: Labels; className?: string }) {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const update = () => setState(openStateAt(new Date()));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className={cn("meta flex min-h-5 items-center gap-2 text-muted", className)} aria-live="polite">
      {state ? (
        <>
          <span
            aria-hidden
            className={cn("size-1.5 rounded-full", state.open ? "bg-sage" : "bg-line-strong")}
          />
          {state.open ? (
            <span>
              {labels.openNow} · {labels.until} <span className="tabular">{state.closes}</span>
            </span>
          ) : (
            <span>
              {labels.closedNow}
              {state.opensNext ? (
                <>
                  {" "}
                  · {labels.opensAt} {labels[state.opensNext.label]}{" "}
                  <span className="tabular">{state.opensNext.time}</span>
                </>
              ) : null}
            </span>
          )}
        </>
      ) : null}
    </p>
  );
}
