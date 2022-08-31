const productsRouter = require('express').Router();
const { ProductsController } = require('../controllers');
const {
  createProductPayloadValidator,
  updateProductPayloadValidator
} = require('../middlewares/validators');

const productsController = new ProductsController();
productsRouter.post(
  '/create/',
  createProductPayloadValidator,
  productsController.createProduct
);
productsRouter.put(
  '/update/:id',
  updateProductPayloadValidator,
  productsController.updateProduct
);
productsRouter.get('/get/', productsController.getProducts);
productsRouter.delete('/delete/:id', productsController.deleteProduct);

module.exports = productsRouter;
