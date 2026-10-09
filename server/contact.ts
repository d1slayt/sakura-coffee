import "server-only";

import { getDb } from "@/lib/db/client";
import type { ContactInput } from "@/lib/validations/contact";

/** Stores a contact message. Status is always NEW; clients can't set it. */
export async function createContactMessage(input: ContactInput): Promise<{ id: string }> {
  return getDb().contactMessage.create({
    data: {
      name: input.name,
      email: input.email,
      topic: input.topic,
      message: input.message,
    },
    select: { id: true },
  });
}
