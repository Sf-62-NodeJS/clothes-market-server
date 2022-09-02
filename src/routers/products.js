const productsRouter = require('express').Router();
const { ProductsController } = require('../controllers');
const {
  createProductPayloadValidator,
  updateProductPayloadValidator
} = require('../middlewares/validators');

const productsController = new ProductsController();
productsRouter.post(
  '/',
  createProductPayloadValidator,
  productsController.createProduct
);
productsRouter.put(
  '/revision/:id',
  updateProductPayloadValidator,
  productsController.updateProduct
);
productsRouter.get('/stock/', productsController.getProducts);
productsRouter.delete('/:id', productsController.deleteProduct);

module.exports = productsRouter;
