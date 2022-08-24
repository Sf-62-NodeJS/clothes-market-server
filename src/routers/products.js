const productsRouter = require('express').Router();
const { ProductsController } = require('../controllers');

const productsController = new ProductsController();
productsRouter.post('/', productsController.createProduct);
productsRouter.put('/:id', productsController.updateProduct);
productsRouter.get('/:id', productsController.getProduct);
productsRouter.get('/', productsController.getProducts);
productsRouter.delete('/:id', productsController.deleteProduct);

module.exports = productsRouter;
