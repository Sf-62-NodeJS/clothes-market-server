const { SizesService } = require('../services/');

const sizesService = new SizesService();

class SizesController {
  async createSize (req, res) {
    return sizesService.createSize(req, res);
  }

  async updateSize (req, res) {
    return sizesService.updateSize(req, res);
  }

  async deleteSize (req, res) {
    return sizesService.deleteSize(req, res);
  }

  async getSize (req, res) {
    return sizesService.getSize(req, res);
  }
}

module.exports = SizesController;
