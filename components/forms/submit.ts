"use client";

import { startTransition, type FormEvent } from "react";

/**
 * With JavaScript, submit through a transition so React doesn't reset the form
 * (field values survive validation errors). Without JavaScript, the form's
 * `action` attribute posts it to the Server Action as a normal request.
 */
export function submitWithoutReset(event: FormEvent<HTMLFormElement>, action: (data: FormData) => void) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  startTransition(() => action(data));
}
