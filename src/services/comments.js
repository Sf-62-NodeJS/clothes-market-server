const { Comments, Product, ReplyComments } = require('../models');

class CommentsService {
  async checkProduct (productId) {
    const product = await Product.findById(productId).exec();

    return product;
  }

  async createComment (req, res) {
    const product = await this.checkProduct(req.body.productId);

    if (!product) return res.boom.notFound('Product not found.');

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
    const comment = await Comments.findByIdAndUpdate(req.params.id, {
      comment: req.body.comment
    }).exec();

    return comment ? res.json(true) : res.boom.notFound();
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
    const comment = await Comments.findByIdAndDelete(req.params.id).exec();

    if (comment) {
      if (comment.replyComments) {
        await this.deleteReplies(comment.replyComments);
      }

      Product.findOneAndUpdate(
        { comments: req.params.id },
        { $pullAll: { comments: [{ _id: req.params.id }] } }
      );

      return res.json(true);
    }

    return res.boom.notFound();
  }

  async deleteReplies (replyComments) {
    return ReplyComments.deleteMany({
      _id: { $in: replyComments }
    }).exec();
  }
}

module.exports = CommentsService;