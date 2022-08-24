const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories'
  },
  sizes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sizes'
    }
  ],
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductStatuses'
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comments'
    }
  ],
  price: {
    type: Number,
    set: function () {
      return this.parseFloat();
    }
  }
});

module.exports = mongoose.model('Products', productSchema);