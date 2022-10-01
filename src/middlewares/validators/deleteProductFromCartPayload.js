const Joi = require('joi');

const deleteProductFromCartPayload = (req, res, next) => {
  const schema = Joi.object({
    productId: Joi.string().alphanum().length(24),
    sizeId: Joi.string().alphanum().length(24),
    quantity: Joi.number().min(1),
    _id: Joi.string().alphanum().length(24)
  }).or('productId', 'sizeId', 'quantity', '_id');
  const { error } = schema.validate(req.body);

  if (error) {
    return res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};
module.exports = deleteProductFromCartPayload;
