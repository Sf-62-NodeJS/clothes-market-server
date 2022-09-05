const { Sizes } = require('../models');

class SizesService {
  async createSize (req, res) {
    const doesExist = await Sizes.exists(req.body);
    if (doesExist) {
      return res.boom.badRequest('Size already exists.');
    }
    const size = await new Sizes(req.body).save();

    return res.json(size);
  }

  async updateSize (req, res) {
    const size = await Sizes.findByIdAndUpdate(req.params.id, req.body);
    return size ? res.json(size) : res.boom.notFound();
  }

  async deleteSize (req, res) {
    const size = await Sizes.findByIdAndDelete(req.params.id);
    return size ? res.json(size) : res.boom.notFound();
  }

  async getSizes (req, res) {
    const { _id, name } = (typeof req.query !== 'undefined' && req.query) || {};
    const query = {};
    if (_id != null) query._id = _id;
    if (name != null) query.name = name;

    const sizes = await Sizes.find(query);
    return res.json(sizes);
  }
}

module.exports = SizesService;
