const { CommentsService } = require('../services');

class CommentsController {
  #commentsService = new CommentsService();

  createComment = (req, res) => this.#commentsService.createComment(req, res);

  updateComment = (req, res) => this.#commentsService.updateComment(req, res);

  getComments = (req, res) => this.#commentsService.getComments(req, res);

  deleteComment = (req, res) => this.#commentsService.deleteComment(req, res);
}

module.exports = CommentsController;
