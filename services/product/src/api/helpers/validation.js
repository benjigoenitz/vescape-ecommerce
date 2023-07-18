const joi = require('joi');

const createProductSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  price: joi.number().required()
});

const updateProductSchema = joi.object({
  name: joi.string(),
  description: joi.string(),
  price: joi.number(),
  isAvailable: joi.boolean()
});

module.exports = {
  createProductSchema,
  updateProductSchema
};
