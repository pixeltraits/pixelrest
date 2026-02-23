import { z } from 'zod';

const addBodySchema = z.object({
  name: z.string().max(100),
  description: z.string().max(500)
});

export const addSchema = { body: addBodySchema };

export type AddDocumentBody = z.infer<typeof addBodySchema>;
