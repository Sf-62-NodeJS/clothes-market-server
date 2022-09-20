const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderStatuses'
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products'
    }
  ]
});

module.exports = mongoose.model('Orders', orderSchema);
