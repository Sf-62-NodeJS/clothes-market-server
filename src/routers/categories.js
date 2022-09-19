const categoriesRouter = require('express').Router();
const { CategoriesController } = require('../controllers');
const { categoryPayloadValidator } = require('../middlewares/validators');
const { userAuthentication } = require('../middlewares/auth');

const categoriesController = new CategoriesController();
categoriesRouter.post(
  '/',
  userAuthentication('Admin', 'Super admin'),
  categoryPayloadValidator,
  categoriesController.createCategory
);
categoriesRouter.put(
  '/:id',
  userAuthentication('Admin', 'Super admin'),
  categoryPayloadValidator,
  categoriesController.updateCategory
);
categoriesRouter.get('/', categoriesController.getCategories);
categoriesRouter.delete(
  '/:id',
  userAuthentication('Admin', 'Super admin'),
  categoriesController.deleteCategory
);

module.exports = categoriesRouter;
