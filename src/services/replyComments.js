const { Comments, ReplyComments } = require('../models');
const { CommentsService } = require('../services');

const commentsService = new CommentsService();

class ReplyCommentsService {
  async checkComment (commentId) {
    const comment = await Comments.findById(commentId).exec();

    return comment;
  }

  async createReplyComment (req, res) {
    const checkComment = await this.checkComment(req.body.commentId);

    if (!checkComment) return res.boom.notFound('Comment not found.');

    req.body.userId = req.session.passport.user.id;
    const replyComment = await new ReplyComments(req.body).save();

    if (replyComment) {
      await Comments.updateOne(
        { _id: req.body.commentId },
        { $push: { replyComments: replyComment._id } }
      ).exec();
    }

    return replyComment ? res.json(true) : res.json(false);
  }

  async updateReplyComment (req, res) {
    const replyComment = await ReplyComments.findById(req.params.id).exec();

    if (!replyComment) return res.boom.notFound();

    const checkAuth = await commentsService.checkAuth(
      req.session.passport.user.role
    );

    if (
      replyComment.userId + '' === req.session.passport.user.id ||
      checkAuth
    ) {
      const updateReplyComment = await ReplyComments.findByIdAndUpdate(
        req.params.id,
        {
          comment: req.body.comment
        }
      ).exec();

      return updateReplyComment ? res.json(true) : res.boom.notFound();
    }

    return res.boom.unauthorized();
  }

  async getReplyComments (req, res) {
    const checkComment = await this.checkComment(req.query.commentId);

    if (!checkComment) return res.boom.notFound('Comment not found.');

    const count = ReplyComments.find({
      _id: { $in: checkComment.replyComments }
    }).count();
    const comment = await ReplyComments.find({
      _id: { $in: checkComment.replyComments }
    }).exec();

    return {
      total_size: count,
      list: comment ? res.json(comment) : res.json([])
    };
  }

  async deleteReplyComment (req, res) {
    const replyComment = await ReplyComments.findById(req.params.id).exec();

    if (!replyComment) return res.boom.notFound();

    const checkAuth = await commentsService.checkAuth(
      req.session.passport.user.role
    );

    if (
      replyComment.userId + '' === req.session.passport.user.id ||
      checkAuth
    ) {
      const deleteReplyComment = await ReplyComments.findByIdAndDelete(
        req.params.id
      ).exec();

      await Comments.findOneAndUpdate(
        { replyComments: req.params.id },
        { $pull: { replyComments: req.params.id } }
      ).exec();

      return deleteReplyComment ? res.json(true) : res.boom.notFound();
    }

    return res.boom.unauthorized();
  }
}

module.exports = ReplyCommentsService;
