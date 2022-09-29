const Joi = require('joi');

const updateUserPasswordPayload = (req, res, next) => {
  const schema = Joi.object({
    oldPassword: Joi.string().min(8).max(100).required(),
    newPassword: Joi.string().min(8).max(100).required()
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = updateUserPasswordPayload;
