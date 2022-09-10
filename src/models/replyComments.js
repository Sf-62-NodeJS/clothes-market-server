const mongoose = require('mongoose');

const replyCommentsSchema = new mongoose.Schema({
  comment: String
});

module.exports = mongoose.model('ReplyComments', replyCommentsSchema);
