const {
  Product,
  ProductStatuses,
  Categories,
  Comments,
  ReplyComments
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

  async createProduct (req, res) {
    const category = await this.getCategory(req.body.category);

    if (!category) {
      return res.boom.notFound(`Category ${req.body.category} doesn't exist.`);
    }

    req.body.category = category;
    req.body.status = await this.getStatus('Available');

    await productImageService.uploadImage(req);
    const product = await new Product(req.body).save();

    return res.json(product);
  }

  async updateProduct (req, res) {
    const available = await Product.findById(req.params.id).exec();

    if (available) {
      if (req.body.category) {
        const category = await this.getCategory(req.body.category);

        if (!category) {
          return res.boom.notFound(
            `Category ${req.body.category} doesn't exist.`
          );
        }

        req.body.category = category;
      }

      if (req.files) {
        if (available.image.length) {
          await productImageService.deleteImage(available.image);
        }

        await productImageService.uploadImage(req);
      }

      if (req.body.status) {
        const status = await this.getStatus(req.body.status);

        if (!status) {
          return res.boom.badRequest(
            'Status must be Available or Not available'
          );
        }

        req.body.status = status;
      }
    } else {
      return res.boom.notFound('Product not found');
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
      if (product.image) {
        await productImageService.deleteImage(product.image);
      }

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

    return await Comments.deleteMany({ _id: { $in: comments } }).exec();
  }
}

module.exports = ProductsService;
