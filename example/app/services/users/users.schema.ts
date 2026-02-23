import { z } from 'zod';
import { passwordSchema } from '../password.schema.js';

const getByIdBodySchema = z.object({
  id: z.coerce.number().int()
});

const updateInformationsBodySchema = z.object({
  id: z.number().int(),
  firstname: z.string().max(50),
  lastname: z.string().max(50),
  email: z.string().email().max(100)
});

const updatePasswordBodySchema = z.object({
  id: z.number().int(),
  password: passwordSchema,
  oldPassword: passwordSchema
});

const addBodySchema = z.object({
  firstname: z.string().max(50),
  lastname: z.string().max(50),
  email: z.string().email().max(100),
  password: passwordSchema,
  roles: z.string()
});

export const getByIdSchema = { params: getByIdBodySchema };
export const updateInformationsSchema = { body: updateInformationsBodySchema };
export const updatePasswordSchema = { body: updatePasswordBodySchema };
export const addSchema = { body: addBodySchema };

export type GetByIdParams = z.infer<typeof getByIdBodySchema>;
export type UpdateInformationsBody = z.infer<typeof updateInformationsBodySchema>;
export type UpdatePasswordBody = z.infer<typeof updatePasswordBodySchema>;
export type AddUserBody = z.infer<typeof addBodySchema>;
