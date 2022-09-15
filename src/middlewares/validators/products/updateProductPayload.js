const Joi = require('joi');

const updateProductPayloadValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30),
    description: Joi.string().min(2).max(30),
    category: Joi.string(),
    sizes: Joi.string().min(1),
    status: Joi.string().min(9).max(13),
    price: Joi.number()
  });
  const { error } = schema.validate(req.body);

  if (error) {
    res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = updateProductPayloadValidator;
