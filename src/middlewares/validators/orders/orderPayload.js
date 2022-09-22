const Joi = require('joi');

const orderPayloadValidator = (req, res, next) => {
  const schema = Joi.object({
    products: Joi.array().items(Joi.string().hex().length(24)).required()
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = orderPayloadValidator;
