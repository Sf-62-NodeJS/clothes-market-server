const { Categories } = require('../models');

class CategoriesService {
  async checkCategory (name) {
    const category = await Categories.findOne({
      name
    }).exec();

    return category;
  }

  async createCategory (req, res) {
    const exists = await this.checkCategory(req.body.name);

    if (exists !== null) {
      return res.boom.badRequest(`Category ${req.body.name} already exists.`);
    }

    const category = await new Categories(req.body).save();

    return category ? res.json(true) : res.json(false);
  }

  async updateCategory (req, res) {
    const exists = await this.checkCategory(req.body.name);

    if (exists !== null) {
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

    if (_id != null) query._id = _id;
    if (name != null) {
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
    const category = await Categories.findByIdAndDelete(req.params.id).exec();

    return category ? res.json(true) : res.boom.notFound();
  }
}

module.exports = CategoriesService;
