const { Product } = require('../models');

class ProductsService {
  async createProduct (req, res) {
    const newProduct = await new Product(req.body).save();

    return res.json(newProduct);
  }

  async updateProduct (req, res) {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body
    ).exec();

    return updateProduct ? res.json(updateProduct) : res.boom.notFound();
  }

  async getProducts (req, res) {
    const getProducts = await Product.find(req.query)
      .skip(+req.query.skip || 0)
      .limit(+req.query.take || 50)
      .exec();

    return getProducts ? res.json(getProducts) : res.json([]);
  }

  async deleteProduct (req, res) {
    const deleteProduct = await Product.findByIdAndDelete(
      req.params.id
    ).exec();

    return deleteProduct ? res.json(deleteProduct) : res.boom.notFound();
  }
}

module.exports = ProductsService;
