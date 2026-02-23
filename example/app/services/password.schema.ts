import Joi from 'joi';

export const passwordSchema = Joi.string().required().min(8).max(255);
