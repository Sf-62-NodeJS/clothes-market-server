const mongoose = require('mongoose');

const userStatusesSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('UserStatuses', userStatusesSchema);
