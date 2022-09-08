const categoriesRouter = require('express').Router();
const { CategoriesController } = require('../controllers');
const { categoryPayloadValidator } = require('../middlewares/validators');
const { verifyRole } = require('../middlewares/auth');

const categoriesController = new CategoriesController();
categoriesRouter.post(
  '/',
  verifyRole('Admin', 'Super admin'),
  categoryPayloadValidator,
  categoriesController.createCategory
);
categoriesRouter.put(
  '/:id',
  verifyRole('Admin', 'Super admin'),
  categoryPayloadValidator,
  categoriesController.updateCategory
);
categoriesRouter.get('/', categoriesController.getCategories);
categoriesRouter.delete(
  '/:id',
  verifyRole('Admin', 'Super admin'),
  categoriesController.deleteCategory
);

module.exports = categoriesRouter;
