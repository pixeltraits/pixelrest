import Joi from 'joi';
import { passwordSchema } from '../password.schema.js';

export const connexionSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required().max(100),
    password: passwordSchema
  })
};
