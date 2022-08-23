const mongoose = require('mongoose');

const productStatusesSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('ProductStatuses', productStatusesSchema);