const categoriesRouter = require('express').Router();
const { CategoriesController } = require('../controllers');
const {
  createCategoryPayloadValidator,
  updateCategoryPayloadValidator
} = require('../middlewares/validators');

const categoriesController = new CategoriesController();
categoriesRouter.post(
  '/',
  createCategoryPayloadValidator,
  categoriesController.createCategory
);
categoriesRouter.put(
  '/:id',
  updateCategoryPayloadValidator,
  categoriesController.updateCategory
);
categoriesRouter.get('/', categoriesController.getCategories);
categoriesRouter.delete('/:id', categoriesController.deleteCategory);

module.exports = categoriesRouter;
