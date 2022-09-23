const Joi = require('joi');

const addProductToCartPayload = (req, res, next) => {
  const schema = Joi.object({
    productId: Joi.string().required().alphanum().length(24),
    sizeId: Joi.string().required().alphanum().length(24),
    quantity: Joi.number().min(1).required()
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};
module.exports = addProductToCartPayload;
