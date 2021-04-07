import Joi from "joi";


export const getListByIdSchema = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};
