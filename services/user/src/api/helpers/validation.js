const joi = require('joi');

const signUpSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  name: joi.string().required(),
  lastName: joi.string().required()
});

const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
});

module.exports = {
  signUpSchema,
  signInSchema
};
