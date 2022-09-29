const mongoose = require('mongoose');

const replyCommentsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comment: String
});

module.exports = mongoose.model('ReplyComments', replyCommentsSchema);
