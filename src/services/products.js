const { Product } = require('../models');
const { productImageService } = require('../uploads');

class ProductsService {
  async createProduct (req, res) {
    await productImageService.uploadImage(req);
    const newProduct = await new Product(req.body).save();

    return res.json(newProduct);
  }

  async updateProduct (req, res) {
    if (req.files) {
      const checkImage = await Product.findById(req.params.id).exec();

      if (checkImage.image.length !== 0) {
        await productImageService.deleteImage(checkImage.image);
      }

      await productImageService.uploadImage(req);
    }

    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body
    ).exec();

    return updateProduct ? res.json(true) : res.boom.notFound();
  }

  async getProducts (req, res) {
    const { _id, name, category, sizes, status, minPrice, maxPrice } =
            (typeof req.query !== 'undefined' && req.query) || {};
    const query = {};
    const regexNums = /^[0-9.]*$/gm;
    const regexForId = /^[0-9a-zA-Z]*$/gm;
    const lengthForId = 24;

    if (
      _id != null &&
            _id.match(regexForId) &&
            _id.length === lengthForId
    ) {
      query._id = _id;
    }
    if (name != null) query.name = name;
    if (
      category != null &&
            category.match(regexForId) &&
            category.length === lengthForId
    ) {
      query.category = category;
    }
    if (
      sizes != null &&
            sizes.match(regexForId) &&
            sizes.length === lengthForId
    ) {
      query.sizes = sizes;
    }
    if (
      status != null &&
            status.match(regexForId) &&
            status.length === lengthForId
    ) {
      query.status = status;
    }
    if (minPrice == null || maxPrice == null) {
      if (minPrice != null && minPrice.match(regexNums)) {
        query.price = { $gte: minPrice };
      }
      if (maxPrice != null && maxPrice.match(regexNums)) {
        query.price = { $lte: maxPrice };
      }
    }
    if (
      minPrice != null &&
            maxPrice != null &&
            minPrice.match(regexNums) &&
            maxPrice.match(regexNums)
    ) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    const getProducts = await Product.find(query)
      .skip(+req.query.skip || 0)
      .limit(+req.query.take || 50)
      .exec();

    return getProducts ? res.json(getProducts) : res.json([]);
  }

  async deleteProduct (req, res) {
    const deleteProduct = await Product.findByIdAndDelete(
      req.params.id
    ).exec();

    if (deleteProduct) {
      await productImageService.deleteImage(deleteProduct.image);

      return res.json(true);
    }

    return res.boom.notFound();
  }
}

module.exports = ProductsService;
