const Joi = require('joi');

const getUsersQueryValidator = (req, res, next) => {
  const schema = Joi.object({
    _id: Joi.string().hex().length(24),
    name: Joi.string().alphanum().min(2).max(45).trim(true),
    email: Joi.string().trim(true).email(),
    status: Joi.string().hex().length(24),
    role: Joi.string().hex().length(24),
    skip: Joi.number(),
    take: Joi.number()
  });
  const { error } = schema.validate(req.query);

  if (error) {
    return res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = getUsersQueryValidator;
