const Joi = require('joi');

const createUserPayloadValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .alphanum()
      .min(2)
      .max(30)
      .trim(true)
      .pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required(),

    surname: Joi.string()
      .alphanum()
      .min(2)
      .max(30)
      .trim(true)
      .pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required(),

    midlleName: Joi.string()
      .alphanum()
      .min(2)
      .max(30)
      .trim(true)
      .pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required(),

    hashedPassword: Joi.string().required(),

    phoneNumber: Joi.string()
      .trim(true)
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),

    address: Joi.string().trim(true).lowercase().required(),

    email: Joi.string().trim(true).lowercase().email().required()
  });
  const { error } = schema.validate(req.body);

  if (error) {
    res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = createUserPayloadValidator;
