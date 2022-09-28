const Joi = require('joi');

const updateOrderPayloadValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(2).max(45).trim(true),
    surname: Joi.string().alphanum().min(2).max(45).trim(true),
    middleName: Joi.string().alphanum().min(2).max(45).trim(true),
    phoneNumber: Joi.string().trim(true).length(10).pattern(/^\d+$/),
    address: Joi.string().trim(true),
    orderStatus: Joi.string().hex().length(24),
    productsToAdd: Joi.array().items(Joi.string().hex().length(24)),
    productsToDelete: Joi.array().items(Joi.string().hex().length(24))
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = updateOrderPayloadValidator;
