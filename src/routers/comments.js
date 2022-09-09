const commentsRouter = require('express').Router();
const { CommentsController } = require('../controllers');
const {
  createCommentsPayloadValidator,
  updateCommentsPayloadValidator
} = require('../middlewares/validators');
// const { checkAuth, verifyRole } = require('../middlewares/auth');

const commentsController = new CommentsController();
commentsRouter.post(
  '/',
  // checkAuth,
  // verifyRole('User', Admin', 'Super admin'),
  createCommentsPayloadValidator,
  commentsController.createCategory
);
commentsRouter.put(
  '/:id',
  // checkAuth,
  // verifyRole('User', Admin', 'Super admin'),
  updateCommentsPayloadValidator,
  commentsController.updateCategory
);
commentsRouter.get('/', commentsController.getCategories);
commentsRouter.delete(
  '/:id',
  // checkAuth,
  // verifyRole('User', Admin', 'Super admin'),
  commentsController.deleteCategory
);

module.exports = commentsRouter;
