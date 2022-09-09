const { CommentsService } = require('../services');

class CommentsController {
  #commentsService = new CommentsService();

  createCategory = (req, res) => this.#commentsService.createComment(req, res);

  updateCategory = (req, res) => this.#commentsService.updateComment(req, res);

  getCategories = (req, res) => this.#commentsService.getComments(req, res);

  deleteCategory = (req, res) => this.#commentsService.deleteComment(req, res);
}

module.exports = CommentsController;
