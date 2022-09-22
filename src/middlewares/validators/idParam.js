const Joi = require('joi');

const idParamValidator = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required()
  });
  const { error } = schema.validate(req.params);

  if (error) {
    return res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = idParamValidator;
