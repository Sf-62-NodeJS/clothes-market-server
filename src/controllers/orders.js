const { OrdersService } = require('../services');

class OrdersController {
  #ordersService = new OrdersService();

  createOrder = (req, res) => this.#ordersService.createOrder(req, res);

  getOrders = (req, res) => this.#ordersService.getOrders(req, res);

  updateOrder = (req, res) => this.#ordersService.updateOrder(req, res);

  deleteOrder = (req, res) => this.#ordersService.deleteOrder(req, res);

  resolveOrder = (req, res) => this.#ordersService.resolveOrder(req, res);

  rejectOrder = (req, res) => this.#ordersService.rejectOrder(req, res);
}

module.exports = OrdersController;
