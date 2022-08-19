const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  surname: String,
  middleName: String,
  hashedPassword: String,
  phoneNumber: String,
  address: String,
  email: String,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products'
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
