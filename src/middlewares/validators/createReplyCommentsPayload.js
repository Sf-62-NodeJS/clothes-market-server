const Joi = require('joi');

const createReplyCommentsPayloadValidator = (req, res, next) => {
  const schema = Joi.object({
    comment: Joi.string().min(2).required(),
    commentId: Joi.string().alphanum().min(24).required()
  });
  const { error } = schema.validate(req.body);

  if (error) {
    res.boom.badRequest(`Validation error: ${error.details[0].message}`);
  }

  next();
};

module.exports = createReplyCommentsPayloadValidator;
