const UserRoles = require('../models');

async function migrateUserRoles () {
  await UserRoles.updateMany(
    { name: { $exists: false } },
    { $set: { name: 'User' } }
  );
}

module.exports = migrateUserRoles();
