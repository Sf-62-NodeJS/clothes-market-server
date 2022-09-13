const mongoose = require('mongoose');

const orderStatusesSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('OrderStatuses', orderStatusesSchema);
