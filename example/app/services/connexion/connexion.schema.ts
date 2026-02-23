import { z } from 'zod';
import { passwordSchema } from '../password.schema.js';

const bodySchema = z.object({
  email: z.string().email().max(100),
  password: passwordSchema
});

export const connexionSchema = { body: bodySchema };
export type ConnexionBody = z.infer<typeof bodySchema>;
