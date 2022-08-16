const mongoose = require('mongoose');

const userRolesSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('UserRoles', userRolesSchema);
