const { Categories, Product } = require('../models');

class CategoriesService {
  async checkCategory (categoryName) {
    const category = await Categories.findOne({
      name: { $regex: categoryName, $options: 'i' }
    }).exec();

    return category;
  }

  async createCategory (req, res) {
    const exists = await this.checkCategory(req.body.name);

    if (exists) {
      return res.boom.badRequest(`Category ${req.body.name} already exists.`);
    }

    const category = await new Categories(req.body).save();

    return category ? res.json(true) : res.json(false);
  }

  async updateCategory (req, res) {
    const exists = await this.checkCategory(req.body.name);

    if (exists) {
      return res.boom.badRequest(`Category ${req.body.name} already exists.`);
    }

    const category = await Categories.findByIdAndUpdate(req.params.id, {
      name: req.body.name
    }).exec();

    return category ? res.json(true) : res.boom.notFound();
  }

  async getCategories (req, res) {
    const { _id, name } = req.query;
    const query = {};

    if (_id) query._id = _id;
    if (name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }

    const count = Categories.find(query).count();
    const category = await Categories.find(query).exec();

    return {
      total_size: count,
      list: category ? res.json(category) : res.json([])
    };
  }

  async deleteCategory (req, res) {
    const product = await Product.find({
      category: { $in: req.params.id }
    }).exec();

    if (product.length > 0) {
      return res.boom.badRequest('There are still products in this category.');
    }

    const category = await Categories.findByIdAndDelete(req.params.id).exec();

    return category ? res.json(true) : res.boom.notFound();
  }
}

module.exports = CategoriesService;
