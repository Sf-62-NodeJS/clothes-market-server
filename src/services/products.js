const {
  Product,
  ProductStatuses,
  Categories,
  Comments,
  ReplyComments,
  Sizes
} = require('../models');
const { productImageService } = require('../uploads');

class ProductsService {
  async getStatus (statusName) {
    const status = await ProductStatuses.findOne({
      name: { $regex: statusName, $options: 'i' }
    }).exec();

    return status ? status._id : null;
  }

  async getCategory (categoryName) {
    const category = await Categories.findOne({
      name: { $regex: categoryName, $options: 'i' }
    }).exec();

    return category ? category._id : null;
  }

  async getSizes (sizesName) {
    const sizes = [];
    const find = await Sizes.find({ name: { $in: [...sizesName] } }).exec();

    if (find.length === 0) return null;

    for (const size of find) {
      sizes.push(size._id);
    }

    return sizes;
  }

  async createProduct (req, res) {
    const category = await this.getCategory(req.body.category);

    if (!category) {
      return res.boom.notFound(`Category ${req.body.category} doesn't exist.`);
    }

    const sizes = await this.getSizes(req.body.sizes);

    if (!sizes) {
      return res.boom.notFound('Sizes are not found.');
    }

    req.body.sizes = sizes;
    req.body.category = category;
    req.body.status = await this.getStatus('Available');

    await productImageService.uploadImage(req);
    const product = await new Product(req.body).save();

    return product ? res.json(true) : res.json(false);
  }

  async updateProduct (req, res) {
    const available = await Product.findById(req.params.id).exec();
    const { category, status, sizes } = req.body;

    if (!available) return res.boom.notFound('Product not found');

    if (category) {
      const categoryId = await this.getCategory(category);

      if (!categoryId) {
        return res.boom.notFound(`Category ${category} doesn't exist.`);
      }

      req.body.category = categoryId;
    }

    if (req.files) {
      await productImageService.deleteImage(available.image);
      await productImageService.uploadImage(req);
    }

    if (status) {
      const statusId = await this.getStatus(status);

      if (!statusId) {
        return res.boom.badRequest('Status must be Available or Not available');
      }

      req.body.status = statusId;
    }

    if (sizes) {
      const sizesId = await this.getSizes(sizes);

      if (!sizesId) {
        return res.boom.notFound('Sizes are not found.');
      }

      req.body.sizes = sizesId;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body
    ).exec();

    return product ? res.json(true) : res.boom.notFound('Product not found');
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
      const getCategory = await this.getCategory(category);
      query.category = { $in: getCategory };
    }
    if (sizes) {
      const getSizes = await this.getSizes(sizes);
      query.sizes = { $in: getSizes };
    }
    if (status) {
      const getStatus = await this.getStatus(status);
      query.status = { $in: getStatus };
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

      if (product.comments.length) {
        await this.deleteComments(product.comments);
      }

      return res.json(true);
    }

    return res.boom.notFound();
  }

  async deleteComments (comments) {
    const commentsList = await Comments.find({ _id: { $in: comments } }).exec();

    for (const comment of commentsList) {
      if (comment.replyComments) {
        await ReplyComments.deleteMany({
          _id: { $in: comment.replyComments }
        }).exec();
      }
    }

    return Comments.deleteMany({ _id: { $in: comments } }).exec();
  }
}

module.exports = ProductsService;
