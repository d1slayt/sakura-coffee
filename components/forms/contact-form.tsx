"use client";

import { useActionState, useState } from "react";
import { idleState, type FormState } from "@/lib/form-state";
import { cn } from "@/lib/utils";
import { contactTopics, type ContactTopic } from "@/lib/validations/contact";
import { submitContact, type ContactField } from "@/server/actions";
import { ActionButton } from "@/components/ui/action";
import { BotFields } from "./bot-fields";
import { describedBy, Field, inputClass } from "./field";
import { FormError, FormSuccess } from "./form-status";
import { submitWithoutReset } from "./submit";

export interface ContactLabels {
  name: string;
  email: string;
  topic: string;
  message: string;
  submit: string;
  submitting: string;
  successTitle: string;
  another: string;
  topics: Record<ContactTopic, string>;
}

export function ContactForm({ labels }: { labels: ContactLabels }) {
  const [instance, setInstance] = useState(0);
  return <ContactFormInner key={instance} labels={labels} onReset={() => setInstance((n) => n + 1)} />;
}

function ContactFormInner({ labels, onReset }: { labels: ContactLabels; onReset: () => void }) {
  const [state, formAction, pending] = useActionState<FormState<ContactField>, FormData>(submitContact, idleState);

  if (state.status === "success") {
    return (
      <FormSuccess
        title={labels.successTitle}
        action={
          <ActionButton variant="outline" onClick={onReset}>
            {labels.another}
          </ActionButton>
        }
      >
        <p>{state.message}</p>
      </FormSuccess>
    );
  }

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? (state.values ?? {}) : {};

  return (
    <form action={formAction} onSubmit={(e) => submitWithoutReset(e, formAction)} noValidate className="relative space-y-6">
      <BotFields id="contact" />
      {state.status === "error" ? <FormError message={state.message} /> : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="contact-name" label={labels.name} error={errors.name}>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={80}
            defaultValue={values.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("contact-name", errors.name)}
            className={inputClass}
          />
        </Field>
        <Field id="contact-email" label={labels.email} error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            defaultValue={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("contact-email", errors.email)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field id="contact-topic" label={labels.topic} error={errors.topic}>
        <select
          id="contact-topic"
          name="topic"
          defaultValue={values.topic || "GENERAL"}
          aria-invalid={errors.topic ? true : undefined}
          aria-describedby={describedBy("contact-topic", errors.topic)}
          className={cn(inputClass, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M4 6l4 4 4-4%22 fill=%22none%22 stroke=%22%23241c19%22 stroke-width=%221.5%22/></svg>')] bg-[length:16px] bg-[right_0.875rem_center] bg-no-repeat pr-10")}
        >
          {contactTopics.map((topic) => (
            <option key={topic} value={topic}>
              {labels.topics[topic]}
            </option>
          ))}
        </select>
      </Field>

      <Field id="contact-message" label={labels.message} error={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          maxLength={2000}
          defaultValue={values.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("contact-message", errors.message)}
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      <ActionButton type="submit" variant="outline" disabled={pending} arrow>
        {pending ? labels.submitting : labels.submit}
      </ActionButton>
    </form>
  );
}
