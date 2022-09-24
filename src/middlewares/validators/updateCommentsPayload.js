const Joi = require('joi');

const updateCommentsPayloadValidator = (req, res, next) => {
  const schema = Joi.object({
    comment: Joi.string().min(2).required()
  });
  const { error } = schema.validate(req.body);

  if (error) {
    res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = updateCommentsPayloadValidator;
