const { UsersService } = require('../services');

class UsersController {
  #usersService = new UsersService();

  createUser = (req, res) => this.#usersService.createUser(req, res);

  getUsers = (req, res) => this.#usersService.getUsers(req, res);

  updateUser = (req, res) => this.#usersService.updateUser(req, res);

  updateUserPassword = (req, res) =>
    this.#usersService.updateUserPassword(req, res);

  createAdmin = (req, res) => this.#usersService.createAdmin(req, res);

  blockUser = (req, res) => this.#usersService.blockUser(req, res);

  deleteUser = (req, res) => this.#usersService.deleteUser(req, res);

  addProductsToCart = (req, res) =>
    this.#usersService.addProductsToCart(req, res);

  deleteProductsFromCart = (req, res) =>
    this.#usersService.deleteProductsFromCart(req, res);

  getProductsFromCart = (req, res) =>
    this.#usersService.getProductsFromCart(req, res);
}

module.exports = UsersController;
