const commentsRouter = require('express').Router();
const { CommentsController } = require('../controllers');
const {
  createCommentsPayloadValidator,
  updateCommentsPayloadValidator
} = require('../middlewares/validators');
const { checkAuth, verifyRole } = require('../middlewares/auth');

const commentsController = new CommentsController();
commentsRouter.post(
  '/',
  checkAuth,
  verifyRole('User', 'Admin', 'Super admin'),
  createCommentsPayloadValidator,
  commentsController.createComment
);
commentsRouter.put(
  '/:id',
  checkAuth,
  verifyRole('User', 'Admin', 'Super admin'),
  updateCommentsPayloadValidator,
  commentsController.updateComment
);
commentsRouter.get('/', commentsController.getComments);
commentsRouter.delete(
  '/:id',
  checkAuth,
  verifyRole('User', 'Admin', 'Super admin'),
  commentsController.deleteComment
);

module.exports = commentsRouter;
