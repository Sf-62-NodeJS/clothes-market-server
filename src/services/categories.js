const { Categories } = require('../models');

class CategoriesService {
  async createCategory (req, res) {
    const category = await new Categories(req.body).save();

    return res.json(category);
  }

  async updateCategory (req, res) {
    const category = await Categories.findByIdAndUpdate(req.params.id, {
      name: req.body.name
    }).exec();

    return category ? res.json(true) : res.boom.notFound();
  }

  async getCategories (req, res) {
    const { _id, name } = (typeof req.query !== 'undefined' && req.query) || {};
    const query = {};

    if (_id != null) query._id = _id;
    if (name != null) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }

    const count = await Categories.find(query).count();
    const category = await Categories.find(query).exec();

    return {
      total_number: count,
      categories: category ? res.json(category) : res.json([])
    };
  }

  async deleteCategory (req, res) {
    const category = await Categories.findByIdAndDelete(req.params.id).exec();

    return category ? res.json(true) : res.boom.notFound();
  }
}

module.exports = CategoriesService;
