const { UserRoles } = require('../models');

const listUserRoles = {
  user: 'User',
  admin: 'Admin',
  superAdmin: 'Super admin'
};

const checkAvailability = async function () {
  try {
    Object.values(listUserRoles).forEach(async (role) => {
      const findUserRole = await UserRoles.findOne({ name: role });
      if (!findUserRole) {
        UserRoles.create({ name: role });
      }
    });
  } catch (error) {
    console.log('Error', error);
  }
};

module.exports = checkAvailability;
