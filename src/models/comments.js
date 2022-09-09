const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
  comment: String,
  replyComments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comments'
    }
  ]
});

module.exports = mongoose.model('Comments', commentsSchema);
