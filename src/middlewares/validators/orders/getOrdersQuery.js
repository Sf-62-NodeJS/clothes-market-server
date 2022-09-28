const Joi = require('joi');

const getOrdersQueryValidator = (req, res, next) => {
  const schema = Joi.object({
    _id: Joi.string().hex().length(24),
    status: Joi.string().hex().length(24),
    name: Joi.string().alphanum().min(2).max(45).trim(true),
    skip: Joi.number(),
    take: Joi.number()
  });
  const { error } = schema.validate(req.query);

  if (error) {
    return res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = getOrdersQueryValidator;
