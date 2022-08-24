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

  async getProduct (req, res) {
    const getProduct = await Product.findById(req.params.id).exec();

    return getProduct ? res.json(getProduct) : res.boom.notFound();
  }

  async getProducts (req, res) {
    if (req.query.skip || req.query.take) {
      const getProducts = await Product.find()
        .skip(req.query.skip)
        .limit(req.query.take)
        .exec();

      return getProducts ? res.json(getProducts) : res.boom.notFound();
    } else {
      const getProducts = await Product.find().exec();

      return getProducts ? res.json(getProducts) : res.boom.notFound();
    }
  }

  async deleteProduct (req, res) {
    const deleteProduct = await Product.findByIdAndDelete(
      req.params.id
    ).exec();

    return deleteProduct ? res.json(deleteProduct) : res.boom.notFound();
  }
}

module.exports = ProductsService;
