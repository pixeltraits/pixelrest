const { celebrate, Joi } = require('celebrate');

const getUserSchema = celebrate({
  query: Joi.object().keys({
    id: Joi.any()
  })
});

const updateInformationsSchema = celebrate({
  body: Joi.object().keys({
    id: Joi.number().integer().required(),
    prenom: Joi.string().required().max(50),
    nom: Joi.string().required().max(50),
    mail: Joi.string().email().required().allow('').max(100)
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
    prenom: Joi.string().required().max(50),
    nom: Joi.string().required().max(50),
    mail: Joi.string().email().required().max(100),
    password: Joi.string().required().min(6).max(255),
    role: Joi.string().required()
  })
});

module.exports = {
  getUserSchema,
  updateInformationsSchema,
  updatePasswordSchema,
  postUserSchema
};
