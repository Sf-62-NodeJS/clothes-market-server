const commentsRouter = require('express').Router();
const { CommentsController } = require('../controllers');
const {
  createCommentsPayloadValidator,
  updateCommentsPayloadValidator
} = require('../middlewares/validators');
const { userAuthentication } = require('../middlewares/auth');

const commentsController = new CommentsController();
commentsRouter.post(
  '/',
  userAuthentication('User'),
  createCommentsPayloadValidator,
  commentsController.createComment
);
commentsRouter.put(
  '/:id',
  userAuthentication('Admin', 'Super admin'),
  updateCommentsPayloadValidator,
  commentsController.updateComment
);
commentsRouter.get('/', commentsController.getComments);
commentsRouter.delete(
  '/:id',
  userAuthentication('Admin', 'Super admin'),
  commentsController.deleteComment
);

module.exports = commentsRouter;
