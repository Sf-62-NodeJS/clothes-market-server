const { Orders } = require('../models');
const { OrderStatuses } = require('../models');

class OrdersService {
  async createOrder (req, res) {
    const orderStatus = await OrderStatuses.findOne({
      name: 'In progress'
    }).exec();
    const order = new Orders(req.body);
    order.status = orderStatus._id;
    await order.save();
    return order ? res.json(true) : res.boom.notFound();
  }

  async getOrders (req, res) {
    const { _id, status } = req.query;
    const query = {};

    if (_id) query._id = _id;
    if (status) query.status = status;

    const count = Orders.find(query).countDocuments().exec();
    const orders = await Orders.find(query).exec();
    return {
      total_size: count,
      list: orders ? res.json(orders) : res.json([])
    };
  }

  async updateOrder (req, res) {
    const statusInProgress = await OrderStatuses.findOne({
      name: 'In progress'
    }).exec();
    const order = await Orders.findOne({ _id: req.params.id }).exec();
    if (!order) return res.boom.notFound();
    if (order.status.toString() === statusInProgress._id.toString()) {
      const updated = await Orders.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      }).exec();
      return updated ? res.json(true) : res.boom.notFound();
    } else {
      res.boom.badRequest('cannot update resolved/rejected orders');
    }
  }

  async deleteOrder (req, res) {
    const order = await Orders.findByIdAndDelete(req.params.id).exec();
    if (!order) return res.boom.notFound();
    return order ? res.json(true) : res.boom.notFound();
  }

  async resolveOrder (req, res) {
    await this.#updateStatus(req, res, 'Resolved');
  }

  async rejectOrder (req, res) {
    await this.#updateStatus(req, res, 'Rejected');
  }

  async #updateStatus (req, res, orderStatus) {
    const order = await Orders.findOne({ _id: req.params.id }).exec();
    if (!order) return res.boom.notFound();
    const statuses = await OrderStatuses.find().exec();
    const statusToUpdate = statuses.find(({ name }) => name === orderStatus);
    const statusInProgress = statuses.find(
      ({ name }) => name === 'In progress'
    );
    const currentStatus = order.status;
    if (statusInProgress._id.toString() === currentStatus.toString()) {
      const updated = await Orders.findByIdAndUpdate(
        req.params.id,
        { status: statusToUpdate },
        {
          new: true
        }
      ).exec();
      return updated ? res.json(true) : res.boom.notFound();
    } else {
      return res.boom.badRequest('order already resolved/rejected');
    }
  }
}

module.exports = OrdersService;
