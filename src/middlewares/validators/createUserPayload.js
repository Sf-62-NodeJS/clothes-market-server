const Joi = require('joi');

const createUserPayloadValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(2).max(45).trim(true).required(),
    surname: Joi.string().alphanum().min(2).max(45).trim(true).required(),
    middleName: Joi.string().alphanum().min(2).max(45).trim(true),
    password: Joi.string().min(8).max(100).required(),
    phoneNumber: Joi.string().trim(true).length(10).pattern(/^\d+$/),
    address: Joi.string().trim(true),
    email: Joi.string().trim(true).email().required()
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = createUserPayloadValidator;
