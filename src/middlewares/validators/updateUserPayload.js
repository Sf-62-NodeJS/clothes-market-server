const Joi = require('joi');

const updateUserPayloadValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(2).max(45).trim(true),
    surname: Joi.string().alphanum().min(2).max(45).trim(true),
    middleName: Joi.string().alphanum().min(2).max(45).trim(true),
    phoneNumber: Joi.string().trim(true).length(10).pattern(/^\d+$/),
    address: Joi.string().trim(true)
  });
  const { error } = schema.validate(req.body);

  if (error) {
    res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = updateUserPayloadValidator;
