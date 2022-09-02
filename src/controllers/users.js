const { UsersService } = require('../services');
const usersService = new UsersService();

class UsersController {
  async createUser (req, res) {
    return usersService.createUser(req, res);
  }

  async getUsers (req, res) {
    return usersService.getUsers(req, res);
  }

  async updateUser (req, res) {
    return usersService.updateUser(req, res);
  }

  async updateUserPassword (req, res) {
    return usersService.updateUserPassword(req, res);
  }

  async createAdmin (req, res) {
    return usersService.createAdmin(req, res);
  }

  async blockUser (req, res) {
    return usersService.blockUser(req, res);
  }

  async deleteUser (req, res) {
    return usersService.deleteUser(req, res);
  }
}

module.exports = UsersController;
