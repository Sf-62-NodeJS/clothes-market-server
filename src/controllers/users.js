const { UsersService } = require('../services');
const usersService = new UsersService();

class UsersController {
  async getUser (req, res) {
    return usersService.getUser(req, res);
  }

  async createUser (req, res) {
    return usersService.createUser(req, res);
  }
}

module.exports = UsersController;
