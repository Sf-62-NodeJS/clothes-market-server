const { Sizes } = require('../models');

class SizesService {
  async createSize (req, res) {
    const doesExist = await Sizes.exists(req.body);
    if (doesExist) {
      return res.boom.badRequest('Size already exists.');
    }
    await new Sizes(req.body).save();

    return res.json(true);
  }

  async updateSize (req, res) {
    const doesExist = await Sizes.findOne(req.body);
    if (doesExist) {
      if (String(doesExist._id) === String(req.params.id)) {
        return res.boom.badRequest('Size is alredy set to that value');
      }
      return res.boom.badRequest('Sizes should be unique');
    }
    const size = await Sizes.findByIdAndUpdate(req.params.id, req.body);
    return size ? res.json(true) : res.boom.notFound();
  }

  async deleteSize (req, res) {
    const size = await Sizes.findByIdAndDelete(req.params.id);
    return size ? res.json(true) : res.boom.notFound();
  }

  async getSizes (req, res) {
    const { _id, name } = req.query;
    const query = {};
    if (_id != null) query._id = _id;
    if (name != null) query.name = name;
    const sizes = await Sizes.find(query);
    return sizes.length ? res.json(sizes) : res.boom.notFound();
  }
}

module.exports = SizesService;
