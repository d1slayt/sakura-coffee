import type { Emphasis } from "@/lib/i18n";

/** Renders a headline fragment with its single italic phrase. */
export function EmphasisText({ value, emClassName }: { value: Emphasis; emClassName?: string }) {
  return (
    <>
      {value.before}
      {value.em ? <em className={emClassName}>{value.em}</em> : null}
      {value.after}
    </>
  );
}
