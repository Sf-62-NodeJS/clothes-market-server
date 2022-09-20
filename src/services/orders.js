const { Orders } = require('../models');
const { OrderStatuses } = require('../models');

class OrdersService {
  async createOrder (req, res) {
    try {
      const orderStatus = await OrderStatuses.findOne({
        name: 'In progress'
      }).exec();
      const order = new Orders(req.body);
      order.status = orderStatus._id;
      await order.save();
      return order ? res.json(true) : res.boom.notFound();
    } catch {
      res.boom.badImplementation();
    }
  }

  async getOrders (req, res) {
    try {
      const { _id, status } = req.query;
      const query = {};

      if (_id) query._id = _id;
      if (status) query.status = status;

      const count = Orders.find(query).count();
      const orders = await Orders.find(query).exec();
      return {
        total_size: count,
        list: orders ? res.json(orders) : res.json([])
      };
    } catch {
      res.boom.badImplementation();
    }
  }

  async updateOrder (req, res) {
    try {
      const statusInProgress = await OrderStatuses.findOne({
        name: 'In progress'
      }).exec();
      const order = await Orders.findOne({ _id: req.params.id }).exec();
      if (order.status.toString() === statusInProgress._id.toString()) {
        order.products = req.body.products;
        await order.save();
        return order ? res.json(true) : res.boom.notFound();
      } else {
        res.boom.badRequest('cannot update resolved/rejected orders');
      }
    } catch {
      res.boom.badImplementation();
    }
  }

  async deleteOrder (req, res) {
    try {
      const order = await Orders.findByIdAndDelete(req.params.id).exec();
      if (!order) return res.boom.notFound();
      return order ? res.json(true) : res.boom.notFound();
    } catch {
      res.boom.badImplementation();
    }
  }

  async resolveOrder (req, res) {
    await this.#updateStatus(req, res, 'Resolved');
  }

  async rejectOrder (req, res) {
    await this.#updateStatus(req, res, 'Rejected');
  }

  async #updateStatus (req, res, orderStatus) {
    try {
      const statuses = await OrderStatuses.find().exec();
      const statusResolved = statuses.find(({ name }) => name === orderStatus);
      const statusInProgress = statuses.find(
        ({ name }) => name === 'In progress'
      );
      const order = await Orders.findOne({ _id: req.params.id }).exec();
      if (!order) return res.boom.notFound();
      const currentStatus = order.status;
      if (statusInProgress._id.toString() === currentStatus.toString()) {
        order.status = statusResolved._id;
        await order.save();
        return order ? res.json(true) : res.boom.notFound();
      } else {
        return res.boom.badRequest('order already resolved/rejected');
      }
    } catch {
      res.boom.badImplementation();
    }
  }
}

module.exports = OrdersService;
