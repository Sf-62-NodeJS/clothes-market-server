const { Comments, ReplyComments, UserRoles } = require('../models');

const userRoles = await UserRoles.find({
  name: { $in: ['Admin', 'Super admin'] }
}).exec();

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
    const comment = await ReplyComments.findById(req.params.id).exec();

    if (!comment) return res.boom.notFound();

    if (
      comment.userId + '' === req.session.passport.user.id ||
      userRoles.some(
        (el) => el._id.toString() === req.session.passport.user.role
      )
    ) {
      const update = await ReplyComments.findByIdAndUpdate(req.params.id, {
        comment: req.body.comment
      }).exec();

      return update ? res.json(true) : res.boom.notFound();
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

    if (
      replyComment.userId + '' === req.session.passport.user.id ||
      userRoles.some(
        (el) => el._id.toString() === req.session.passport.user.role
      )
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
