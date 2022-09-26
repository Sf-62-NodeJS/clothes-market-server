const Joi = require('joi');

const updateOrderPayloadValidator = (req, res, next) => {
  const schema = Joi.object({
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
