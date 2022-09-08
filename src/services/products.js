const { Product, ProductStatuses, Categories } = require('../models');
const { productImageService } = require('../uploads');

class ProductsService {
  async setStatus (statusName) {
    const status = await ProductStatuses.findOne({
      name: { $regex: statusName, $options: 'i' }
    }).exec();

    return status._id;
  }

  async setCategory (categoryName) {
    const category = await Categories.findOne({
      name: { $regex: categoryName, $options: 'i' }
    }).exec();

    return category ? category._id : null;
  }

  async createProduct (req, res) {
    const category = await this.setCategory(req.body.category);
    if (!category) {
      return res.boom.notFound(`Category ${req.body.category} doesn't exist.`);
    }
    req.body.category = category;
    req.body.status = await this.setStatus('Available');

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

    if (req.body.status) {
      req.body.status = await this.setStatus(req.body.status);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body
    ).exec();

    return product ? res.json(true) : res.boom.notFound();
  }

  async getProducts (req, res) {
    const { _id, name, category, sizes, status, minPrice, maxPrice } =
      req.query;
    const query = {};

    if (_id) {
      query._id = _id;
    }
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (sizes) {
      query.sizes = sizes;
    }
    if (status) {
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

    const count = Product.find(query).count();
    const products = await Product.find(query)
      .skip(+req.query.skip || 0)
      .limit(+req.query.take || 50)
      .exec();

    return {
      total_size: count,
      list: products ? res.json(products) : res.json([])
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
