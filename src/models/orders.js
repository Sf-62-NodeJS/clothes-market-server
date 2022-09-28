const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: String,
  surname: String,
  middleName: String,
  phoneNumber: String,
  address: String,
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
