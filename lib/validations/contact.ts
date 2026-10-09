import { z } from "zod";
import { emailSchema, messages } from "./common";

export const contactTopics = ["GENERAL", "EVENTS", "WHOLESALE", "PRESS"] as const;
export type ContactTopic = (typeof contactTopics)[number];

export const contactInputSchema = z.object({
  name: z.string().trim().min(2, messages.name).max(80, messages.nameTooLong),
  email: emailSchema,
  topic: z.enum(contactTopics, { error: messages.topic }).default("GENERAL"),
  message: z.string().trim().min(10, messages.messageShort).max(2000, messages.messageLong),
});

export type ContactInput = z.infer<typeof contactInputSchema>;
