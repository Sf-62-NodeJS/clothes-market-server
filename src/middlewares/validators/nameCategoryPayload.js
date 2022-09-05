const Joi = require('joi');

const nameCategoryPayloadValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required()
  });
  const { error } = schema.validate(req.body);

  if (error) {
    res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = nameCategoryPayloadValidator;
