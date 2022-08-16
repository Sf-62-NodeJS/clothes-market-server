const { UserRoles } = require('../models');

class UsersRolesController {
  async getRole (req, res) {
    const userRoles = await UserRoles.findById(req.params.id).exec();

    return userRoles ? res.json(userRoles) : res.boom.notFound();
  }
}

module.exports = UsersRolesController;
