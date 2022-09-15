const { ReplyCommentsService } = require('../services');

class ReplyCommentsController {
  #replyCommentsService = new ReplyCommentsService();

  createReplyComment = (req, res) =>
    this.#replyCommentsService.createReplyComment(req, res);

  updateReplyComment = (req, res) =>
    this.#replyCommentsService.updateReplyComment(req, res);

  getReplyComments = (req, res) =>
    this.#replyCommentsService.getReplyComments(req, res);

  deleteReplyComment = (req, res) =>
    this.#replyCommentsService.deleteReplyComment(req, res);
}

module.exports = ReplyCommentsController;
