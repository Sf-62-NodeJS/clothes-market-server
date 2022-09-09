const categoriesRouter = require('express').Router();
const { CategoriesController } = require('../controllers');
const { categoryPayloadValidator } = require('../middlewares/validators');
const { checkAuth, verifyRole } = require('../middlewares/auth');

const categoriesController = new CategoriesController();
categoriesRouter.post(
  '/',
  checkAuth,
  verifyRole('Admin', 'Super admin'),
  categoryPayloadValidator,
  categoriesController.createCategory
);
categoriesRouter.put(
  '/:id',
  checkAuth,
  verifyRole('Admin', 'Super admin'),
  categoryPayloadValidator,
  categoriesController.updateCategory
);
categoriesRouter.get('/', categoriesController.getCategories);
categoriesRouter.delete(
  '/:id',
  checkAuth,
  verifyRole('Admin', 'Super admin'),
  categoriesController.deleteCategory
);

module.exports = categoriesRouter;
