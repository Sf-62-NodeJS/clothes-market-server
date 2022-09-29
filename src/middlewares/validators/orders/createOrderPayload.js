const Joi = require('joi');

const createOrderPayloadValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(2).max(45).trim(true).required(),
    surname: Joi.string().alphanum().min(2).max(45).trim(true).required(),
    middleName: Joi.string().alphanum().min(2).max(45).trim(true).required(),
    phoneNumber: Joi.string().trim(true).length(10).pattern(/^\d+$/).required(),
    address: Joi.string().trim(true).required(),
    products: Joi.array().items(Joi.string().hex().length(24)).required()
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = createOrderPayloadValidator;
