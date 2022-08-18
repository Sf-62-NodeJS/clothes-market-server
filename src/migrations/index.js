const userRolesMigration = require('./userRolesMigration');

const mongoMigration = async function () {
  try {
    // Add your migration function here
    await userRolesMigration();
  } catch (error) {
    console.log('Error', error);
  }
};

module.exports = mongoMigration;
