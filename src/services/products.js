const { Product } = require('../models');
const { productImageService } = require('../uploads');

class ProductsService {
  async createProduct (req, res) {
    await productImageService.uploadImage(req);
    const product = await new Product(req.body).save();

    return res.json(product);
  }

  async updateProduct (req, res) {
    const available = await Product.findById(req.params.id).exec();

    if (req.files && available) {
      if (available.image.length !== 0) {
        await productImageService.deleteImage(available.image);
      }

      await productImageService.uploadImage(req);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body
    ).exec();

    return product ? res.json(true) : res.boom.notFound();
  }

  async getProducts (req, res) {
    const { _id, name, category, sizes, status, minPrice, maxPrice } =
            (typeof req.query !== 'undefined' && req.query) || {};
    const query = {};

    if (_id != null) {
      query._id = _id;
    }
    if (name != null) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (category != null) {
      query.category = category;
    }
    if (sizes != null) {
      query.sizes = sizes;
    }
    if (status != null) {
      query.status = status;
    }
    if (+Math.abs(minPrice)) {
      query.price = { $gte: minPrice };
    }
    if (+Math.abs(maxPrice)) {
      query.price = { $lte: maxPrice };
    }

    if (+Math.abs(minPrice) && +Math.abs(maxPrice)) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    const count = await Product.find(query).count();
    const products = await Product.find(query)
      .skip(+req.query.skip || 0)
      .limit(+req.query.take || 50)
      .exec();

    return {
      total_size: count,
      products: products ? res.json(products) : res.json([])
    };
  }

  async deleteProduct (req, res) {
    const product = await Product.findByIdAndDelete(req.params.id).exec();

    if (product) {
      await productImageService.deleteImage(product.image);

      return res.json(true);
    }

    return res.boom.notFound();
  }
}

module.exports = ProductsService;
