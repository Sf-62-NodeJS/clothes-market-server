const userRolesMigration = require('./userRolesMigration');

async function migrations () {
  try {
    await userRolesMigration;
  } catch (error) {
    console.log('Error', error);
  }
}

module.exports.migrations = migrations();
