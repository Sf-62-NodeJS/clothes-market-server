const productsRouter = require('express').Router();
const { ProductsController } = require('../controllers');
const {
  createProductPayloadValidator,
  updateProductPayloadValidator
} = require('../middlewares/validators');
const { userAuthentication } = require('../middlewares/auth');

const productsController = new ProductsController();
productsRouter.post(
  '/',
  userAuthentication('Admin', 'Super admin'),
  createProductPayloadValidator,
  productsController.createProduct
);
productsRouter.put(
  '/:id',
  userAuthentication('Admin', 'Super admin'),
  updateProductPayloadValidator,
  productsController.updateProduct
);
productsRouter.get('/', productsController.getProducts);
productsRouter.delete(
  '/:id',
  userAuthentication('Admin', 'Super admin'),
  productsController.deleteProduct
);

module.exports = productsRouter;
