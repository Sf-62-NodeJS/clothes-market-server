const { CategoriesService } = require('../services');
const categoriesService = new CategoriesService();

class CategoriesController {
  async createCategory (req, res) {
    return categoriesService.createCategory(req, res);
  }

  async updateCategory (req, res) {
    return categoriesService.updateCategory(req, res);
  }

  async getCategories (req, res) {
    return categoriesService.getCategories(req, res);
  }

  async deleteCategory (req, res) {
    return categoriesService.deleteCategory(req, res);
  }
}

module.exports = CategoriesController;
