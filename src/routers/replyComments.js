const replyCommentsRouter = require('express').Router();
const { ReplyCommentsController } = require('../controllers');
const {
  createReplyCommentsPayloadValidator,
  updateCommentsPayloadValidator
} = require('../middlewares/validators');
const { userAuthentication } = require('../middlewares/auth');

const replyCommentsController = new ReplyCommentsController();
replyCommentsRouter.post(
  '/',
  userAuthentication('User'),
  createReplyCommentsPayloadValidator,
  replyCommentsController.createReplyComment
);
replyCommentsRouter.put(
  '/:id',
  userAuthentication('Admin', 'Super admin'),
  updateCommentsPayloadValidator,
  replyCommentsController.updateReplyComment
);
replyCommentsRouter.get('/', replyCommentsController.getReplyComments);
replyCommentsRouter.delete(
  '/:id',
  userAuthentication('Admin', 'Super admin'),
  replyCommentsController.deleteReplyComment
);

module.exports = replyCommentsRouter;
