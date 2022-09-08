const categoriesRouter = require('express').Router();
const { CategoriesController } = require('../controllers');
const { categoryPayloadValidator } = require('../middlewares/validators');

const categoriesController = new CategoriesController();
categoriesRouter.post(
  '/',
  categoryPayloadValidator,
  categoriesController.createCategory
);
categoriesRouter.put(
  '/:id',
  categoryPayloadValidator,
  categoriesController.updateCategory
);
categoriesRouter.get('/', categoriesController.getCategories);
categoriesRouter.delete('/:id', categoriesController.deleteCategory);

module.exports = categoriesRouter;
