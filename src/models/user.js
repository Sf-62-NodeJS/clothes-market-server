const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  middleName: String,
  password: String,
  phoneNumber: String,
  address: String,
  email: {
    type: String,
    immutable: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserRoles'
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserStatuses'
  },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
      },
      sizeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sizes'
      },
      quantity: Number
    }
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Orders'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
