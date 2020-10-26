import Joi from '@hapi/joi';


export const connexionSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required().max(100),
    password: Joi.string().required().max(255)
  })
};
