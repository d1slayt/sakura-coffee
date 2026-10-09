"use client";

import { useSyncExternalStore } from "react";

// Time the page became interactive in this browser. Captured once on the
// first client read; `null` during server rendering and hydration.
let interactiveSince: number | null = null;
const noSubscribe = () => () => {};
const readStart = () => (interactiveSince ??= Date.now());
const readServerStart = () => null;

/**
 * Honeypot + timing fields for bot protection (see server/form-guard.ts).
 * The honeypot is hidden from sighted users and screen readers; bots that
 * fill every input trip it. `startedAt` lets the server reject submissions
 * made faster than a person could type.
 */
export function BotFields({ id }: { id: string }) {
  const startedAt = useSyncExternalStore(noSubscribe, readStart, readServerStart);
  return (
    <>
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt ?? ""} readOnly />
    </>
  );
}
