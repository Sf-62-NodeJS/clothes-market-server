const categoriesRouter = require('express').Router();
const { CategoriesController } = require('../controllers');
const { nameCategoryPayloadValidator } = require('../middlewares/validators');

const categoriesController = new CategoriesController();
categoriesRouter.post(
  '/',
  nameCategoryPayloadValidator,
  categoriesController.createCategory
);
categoriesRouter.put(
  '/:id',
  nameCategoryPayloadValidator,
  categoriesController.updateCategory
);
categoriesRouter.get('/', categoriesController.getCategories);
categoriesRouter.delete('/:id', categoriesController.deleteCategory);

module.exports = categoriesRouter;
