const productsRouter = require('express').Router();
const { ProductsController } = require('../controllers');
const {
  createProductPayloadValidator,
  updateProductPayloadValidator
} = require('../middlewares/validators');
const { verifyRole } = require('../middlewares/auth');

const productsController = new ProductsController();
productsRouter.post(
  '/',
  verifyRole('Admin', 'Super admin'),
  createProductPayloadValidator,
  productsController.createProduct
);
productsRouter.put(
  '/:id',
  verifyRole('Admin', 'Super admin'),
  updateProductPayloadValidator,
  productsController.updateProduct
);
productsRouter.get('/', productsController.getProducts);
productsRouter.delete(
  '/:id',
  verifyRole('Admin', 'Super admin'),
  productsController.deleteProduct
);

module.exports = productsRouter;
