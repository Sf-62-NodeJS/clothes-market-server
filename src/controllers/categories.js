const { CategoriesService } = require('../services');

class CategoriesController {
  #categoriesService = new CategoriesService();

  createCategory = (req, res) =>
    this.#categoriesService.createCategory(req, res);

  updateCategory = (req, res) =>
    this.#categoriesService.updateCategory(req, res);

  getCategories = (req, res) => this.#categoriesService.getCategories(req, res);

  deleteCategory = (req, res) =>
    this.#categoriesService.deleteCategory(req, res);
}

module.exports = CategoriesController;
