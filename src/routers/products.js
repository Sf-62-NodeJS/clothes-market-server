const productsRouter = require('express').Router();
const { ProductsController } = require('../controllers');
const {
  createProductPayloadValidator,
  updateProductPayloadValidator
} = require('../middlewares/validators');
const { checkAuth, verifyRole } = require('../middlewares/auth');

const productsController = new ProductsController();
productsRouter.post(
  '/',
  checkAuth,
  verifyRole('Admin', 'Super admin'),
  createProductPayloadValidator,
  productsController.createProduct
);
productsRouter.put(
  '/:id',
  checkAuth,
  verifyRole('Admin', 'Super admin'),
  updateProductPayloadValidator,
  productsController.updateProduct
);
productsRouter.get('/', productsController.getProducts);
productsRouter.delete(
  '/:id',
  checkAuth,
  verifyRole('Admin', 'Super admin'),
  productsController.deleteProduct
);

module.exports = productsRouter;
