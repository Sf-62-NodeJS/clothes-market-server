const { ProductsService } = require('../services');
class ProductsController {
  #productsService = new ProductsService();

  createProduct = (req, res) => this.#productsService.createProduct(req, res);

  updateProduct = (req, res) => this.#productsService.updateProduct(req, res);

  getProducts = (req, res) => this.#productsService.getProducts(req, res);

  deleteProduct = (req, res) => this.#productsService.deleteProduct(req, res);
}

module.exports = ProductsController;
