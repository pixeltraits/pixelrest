const { celebrate, Joi } = require('celebrate');

const getUserSchema = celebrate({
  query: Joi.object().keys({
    id: Joi.any()
  })
});

const updateInformationsSchema = celebrate({
  body: Joi.object().keys({
    id: Joi.number().integer().required(),
    firstname: Joi.string().required().max(50),
    lastname: Joi.string().required().max(50),
    email: Joi.string().email().required().allow('').max(100)
  })
});

const updatePasswordSchema = celebrate({
  body: Joi.object().keys({
    id: Joi.number().integer().required(),
    password: Joi.string().allow('').min(6).max(255),
    oldPassword: Joi.string().allow('').max(255)
  })
});

const postUserSchema = celebrate({
  body: Joi.object().keys({
    firstname: Joi.string().required().max(50),
    lastname: Joi.string().required().max(50),
    email: Joi.string().email().required().max(100),
    password: Joi.string().required().min(6).max(255),
    roles: Joi.string().required()
  })
});

module.exports = {
  getUserSchema,
  updateInformationsSchema,
  updatePasswordSchema,
  postUserSchema
};
