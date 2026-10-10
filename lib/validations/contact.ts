import { z } from "zod";
import { emailSchema, freeTextSchema, messages, nameSchema } from "./common";

export const contactTopics = ["GENERAL", "EVENTS", "WHOLESALE", "PRESS"] as const;
export type ContactTopic = (typeof contactTopics)[number];

export const contactInputSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  topic: z.enum(contactTopics, { error: messages.topic }).default("GENERAL"),
  message: freeTextSchema({ min: 10, max: 2000, tooShort: messages.messageShort, tooLong: messages.messageLong }),
});

export type ContactInput = z.infer<typeof contactInputSchema>;
