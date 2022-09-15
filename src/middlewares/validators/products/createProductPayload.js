const Joi = require('joi');

const createProductPayloadValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(2).max(30).required(),
    category: Joi.string().required(),
    sizes: Joi.required(),
    price: Joi.number().required()
  });
  const { error } = schema.validate(req.body);

  if (error) {
    res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = createProductPayloadValidator;
