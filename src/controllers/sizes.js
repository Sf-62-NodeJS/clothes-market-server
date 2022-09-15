const { SizesService } = require('../services/');

class SizesController {
  #sizesService = new SizesService();

  createSize = (req, res) => this.#sizesService.createSize(req, res);

  updateSize = (req, res) => this.#sizesService.updateSize(req, res);

  deleteSize = (req, res) => this.#sizesService.deleteSize(req, res);

  getSizes = (req, res) => this.#sizesService.getSizes(req, res);
}

module.exports = SizesController;
