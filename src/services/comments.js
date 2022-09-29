const { Comments, Product, ReplyComments, UserRoles } = require('../models');

class CommentsService {
  async checkProduct (productId) {
    const product = await Product.findById(productId).exec();

    return product;
  }

  async createComment (req, res) {
    const product = await this.checkProduct(req.body.productId);

    if (!product) return res.boom.notFound('Product not found.');

    req.body.userId = req.session.passport.user.id;
    const comment = await new Comments(req.body).save();

    if (comment) {
      await Product.updateOne(
        { _id: req.body.productId },
        { $push: { comments: comment._id } }
      ).exec();
    }

    return comment ? res.json(true) : res.json(false);
  }

  async updateComment (req, res) {
    const userRoles = await UserRoles.find({
      name: { $in: ['Admin', 'Super admin'] }
    }).exec();

    const comment = await Comments.findById(req.params.id).exec();

    if (!comment) return res.boom.notFound();

    if (
      comment.userId + '' === req.session.passport.user.id ||
      userRoles.some(
        (el) => el._id.toString() === req.session.passport.user.role
      )
    ) {
      const update = await Comments.findByIdAndUpdate(req.params.id, {
        comment: req.body.comment
      }).exec();

      return update ? res.json(true) : res.boom.notFound();
    }

    return res.boom.unauthorized();
  }

  async getComments (req, res) {
    const product = await this.checkProduct(req.query.productId);

    if (!product) return res.boom.notFound('Product not found.');

    const count = Comments.find({ _id: { $in: product.comments } }).count();
    const comment = await Comments.find({
      _id: { $in: product.comments }
    }).exec();

    return {
      total_size: count,
      list: comment ? res.json(comment) : res.json([])
    };
  }

  async deleteComment (req, res) {
    const userRoles = await UserRoles.find({
      name: { $in: ['Admin', 'Super admin'] }
    }).exec();

    const comment = await Comments.findById(req.params.id).exec();

    if (!comment) return res.boom.notFound();

    if (
      comment.userId + '' === req.session.passport.user.id ||
      userRoles.some(
        (el) => el._id.toString() === req.session.passport.user.role
      )
    ) {
      const deleteComment = await Comments.findByIdAndDelete(
        req.params.id
      ).exec();

      if (deleteComment.replyComments) {
        await this.deleteReplies(deleteComment.replyComments);
      }

      await Product.findOneAndUpdate(
        { comments: req.params.id },
        { $pull: { comments: req.params.id } }
      ).exec();

      return res.json(true);
    }

    return res.boom.unauthorized();
  }

  async deleteReplies (replyComments) {
    return ReplyComments.deleteMany({
      _id: { $in: replyComments }
    }).exec();
  }
}

module.exports = CommentsService;
