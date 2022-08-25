const { ProductsService } = require('../services');

const productsService = new ProductsService();
class ProductsController {
  async createProduct (req, res) {
    return productsService.createProduct(req, res);
  }

  async updateProduct (req, res) {
    return productsService.updateProduct(req, res);
  }

  async getProducts (req, res) {
    return productsService.getProducts(req, res);
  }

  async deleteProduct (req, res) {
    return productsService.deleteProduct(req, res);
  }
}

module.exports = ProductsController;
