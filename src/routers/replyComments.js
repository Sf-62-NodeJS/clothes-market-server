const replyCommentsRouter = require('express').Router();
const { ReplyCommentsController } = require('../controllers');
const {
  createReplyCommentsPayloadValidator,
  updateCommentsPayloadValidator
} = require('../middlewares/validators');
const { checkAuth, verifyRole } = require('../middlewares/auth');

const replyCommentsController = new ReplyCommentsController();
replyCommentsRouter.post(
  '/',
  checkAuth,
  verifyRole('User', 'Admin', 'Super admin'),
  createReplyCommentsPayloadValidator,
  replyCommentsController.createReplyComment
);
replyCommentsRouter.put(
  '/:id',
  checkAuth,
  verifyRole('User', 'Admin', 'Super admin'),
  updateCommentsPayloadValidator,
  replyCommentsController.updateReplyComment
);
replyCommentsRouter.get('/', replyCommentsController.getReplyComments);
replyCommentsRouter.delete(
  '/:id',
  checkAuth,
  verifyRole('User', 'Admin', 'Super admin'),
  replyCommentsController.deleteReplyComment
);

module.exports = replyCommentsRouter;
