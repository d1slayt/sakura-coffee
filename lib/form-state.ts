/** State returned by form Server Actions to `useActionState`. */
export type FormState<TFields extends string = string> =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<TFields, string>>;
      /** Submitted values, so the form can be re-filled without JavaScript state. */
      values?: Partial<Record<TFields, string>>;
    }
  | { status: "success"; message: string; reference?: string };

export const idleState = { status: "idle" } as const satisfies FormState;
