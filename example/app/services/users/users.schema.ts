import Joi from 'joi';
import { passwordSchema } from '../password.schema.js';

export const getByIdSchema = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

export const updateInformationsSchema = {
  body: Joi.object().keys({
    id: Joi.number().integer().required(),
    firstname: Joi.string().required().max(50),
    lastname: Joi.string().required().max(50),
    email: Joi.string().email().required().max(100)
  })
};

export const updatePasswordSchema = {
  body: Joi.object().keys({
    id: Joi.number().integer().required(),
    password: passwordSchema,
    oldPassword: passwordSchema
  })
};

export const addSchema = {
  body: Joi.object().keys({
    firstname: Joi.string().required().max(50),
    lastname: Joi.string().required().max(50),
    email: Joi.string().email().required().max(100),
    password: passwordSchema,
    roles: Joi.string().required()
  })
};
