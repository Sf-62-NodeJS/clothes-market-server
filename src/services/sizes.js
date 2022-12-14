const { Sizes } = require('../models');

class SizesService {
  async createSize (req, res) {
    const doesExist = await Sizes.exists(req.body).exec();

    if (doesExist) {
      return res.boom.badRequest('Size already exists.');
    }
    await new Sizes(req.body).save();
    return res.json(true);
  }

  async updateSize (req, res) {
    const doesNewValueExist = await Sizes.exists(req.body).exec();
    const doesItemExist = await Sizes.exists({ _id: req.params.id }).exec();
    if (!doesItemExist) {
      return res.boom.notFound();
    }
    if (doesNewValueExist) {
      if (String(doesNewValueExist._id) === String(req.params.id)) {
        return res.boom.badRequest('Size is alredy set to that value');
      }
      return res.boom.badRequest('Sizes should be unique');
    }
    await Sizes.findByIdAndUpdate(req.params.id, req.body).exec();
    return res.json(true);
  }

  async deleteSize (req, res) {
    const size = await Sizes.findByIdAndDelete(req.params.id).exec();
    return size ? res.json(true) : res.boom.notFound();
  }

  async getSizes (req, res) {
    const { _id, name } = req.query;
    const query = {};
    if (_id) query._id = _id;
    if (name) query.name = name;
    const sizes = await Sizes.find(query).exec();
    return sizes.length ? res.json(sizes) : res.boom.notFound();
  }
}

module.exports = SizesService;
