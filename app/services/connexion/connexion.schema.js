const { celebrate, Joi } = require('celebrate');

const connexionSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().max(100),
    password: Joi.string().required().max(255)
  })
});

module.exports = connexionSchema;
