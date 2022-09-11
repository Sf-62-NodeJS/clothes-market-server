const { Comments, ReplyComments } = require('../models');

class ReplyCommentsService {
  async checkComment (commentId) {
    const comment = await Comments.findById(commentId).exec();

    return comment;
  }

  async createReplyComment (req, res) {
    const checkComment = await this.checkComment(req.body.commentId);

    if (!checkComment) return res.boom.notFound('Comment not found.');

    const comment = await new ReplyComments(req.body).save();

    if (comment) {
      await Comments.updateOne(
        { _id: req.body.commentId },
        { $push: { replyComments: comment._id } }
      ).exec();
    }

    return comment ? res.json(true) : res.json(false);
  }

  async updateReplyComment (req, res) {
    const comment = await ReplyComments.findByIdAndUpdate(req.params.id, {
      comment: req.body.comment
    }).exec();

    return comment ? res.json(true) : res.boom.notFound();
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
    const comment = await ReplyComments.findByIdAndDelete(req.params.id).exec();

    if (comment) {
      Comments.findOneAndUpdate(
        { replyComments: req.params.id },
        { $pullAll: { replyComments: [{ _id: req.params.id }] } }
      );

      return res.json(true);
    } else {
      return res.boom.notFound();
    }
  }
}

module.exports = ReplyCommentsService;
