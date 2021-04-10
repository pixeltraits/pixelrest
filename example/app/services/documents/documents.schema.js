import Joi from 'joi';


export const addSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().max(100),
    description: Joi.string().required().max(500)
  })
};
