const mongoose = require('mongoose');

const sizesSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Sizes', sizesSchema);
