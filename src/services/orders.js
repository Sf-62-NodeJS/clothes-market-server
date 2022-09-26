const { Orders } = require('../models');
const { OrderStatuses } = require('../models');
const { Product } = require('../models');

class OrdersService {
  async createOrder (req, res) {
    const orderStatus = await OrderStatuses.findOne({
      name: 'In progress'
    }).exec();
    const order = new Orders(req.body);
    order.status = orderStatus._id;
    await order.save();
    return res.json(true);
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
    const order = await Orders.findOne({ _id: req.params.id }).exec();
    if (!order) return res.boom.notFound('order not found');

    const statuses = await OrderStatuses.find().exec();
    const statusInProgress = statuses.find(
      ({ name }) => name === 'In progress'
    );
    const statusResolved = statuses.find(({ name }) => name === 'Resolved');
    const statusRejected = statuses.find(({ name }) => name === 'Rejected');
    const newStatus = req.body.orderStatus;
    const productsToAdd = req.body.productsToAdd;
    const productsToDelete = req.body.productsToDelete;

    if (order.status.toString() !== statusInProgress._id.toString()) {
      res.boom.badRequest('cannot update resolved/rejected orders');
    }

    if (newStatus && (productsToAdd || productsToDelete)) {
      return res.boom.badRequest(
        'cannot add/remove products and change status at the same time'
      );
    }

    if (productsToAdd) {
      const updatedOrder = await this.#addProductsToOrder(req, res, order);
      if (updatedOrder) order.products = updatedOrder.products;
      else {
        return res.boom.notFound('cannot add a product that does not exist');
      }
    }

    if (productsToDelete) {
      const updatedOrder = await this.#deleteProductsFromOrder(req, res, order);
      if (updatedOrder) order.products = updatedOrder.products;
      else {
        return res.boom.notFound('cannot delete a product that does not exist');
      }
    }

    if (newStatus && newStatus === statusResolved._id.toString()) {
      const updatedOrder = await this.#resolveOrder(req, res, order);
      order.status = updatedOrder.status;
    }

    if (newStatus && newStatus === statusRejected._id.toString()) {
      const updatedOrder = await this.#rejectOrder(req, res, order);
      order.status = updatedOrder.status;
    }

    await Orders.findByIdAndUpdate(
      req.params.id,
      {
        products: order.products,
        status: order.status
      },
      { new: true }
    ).exec();

    return res.json(true);
  }

  async deleteOrder (req, res) {
    const order = await Orders.findByIdAndDelete(req.params.id).exec();
    return order ? res.json(true) : res.boom.notFound();
  }

  async #addProductsToOrder (req, res, order) {
    const statusInProgress = await OrderStatuses.findOne({
      name: 'In progress'
    }).exec();

    if (order.status.toString() === statusInProgress._id.toString()) {
      const allProducts = await Product.find().exec();
      for (const product of req.body.productsToAdd) {
        const productFound = allProducts.find(
          ({ _id }) => _id.toString() === product
        );
        if (!productFound) return false;
      }
      order.products.push(...req.body.productsToAdd);
      return order;
    } else {
      res.boom.badRequest('cannot add products to resolved/rejected orders');
    }
  }

  async #deleteProductsFromOrder (req, res, order) {
    const statusInProgress = await OrderStatuses.findOne({
      name: 'In progress'
    }).exec();
    const productsToDelete = req.body.productsToDelete;
    if (order.status.toString() === statusInProgress._id.toString()) {
      for (const product of req.body.productsToDelete) {
        const found = productsToDelete.find((p) => p === product);
        const index = order.products.indexOf(found);
        if (index > -1) order.products.splice(index, 1);
        else return false;
      }
      return order;
    } else {
      res.boom.badRequest('cannot remove products to resolved/rejected orders');
    }
  }

  async #resolveOrder (req, res, order) {
    const resolvedOrder = await this.#updateStatus(req, res, order, 'Resolved');
    return resolvedOrder;
  }

  async #rejectOrder (req, res, order) {
    const rejectedOrder = await this.#updateStatus(req, res, order, 'Rejected');
    return rejectedOrder;
  }

  async #updateStatus (req, res, order, orderStatus) {
    const statuses = await OrderStatuses.find().exec();
    const statusToUpdate = statuses.find(({ name }) => name === orderStatus);
    const statusInProgress = statuses.find(
      ({ name }) => name === 'In progress'
    );
    const currentStatus = order.status;
    if (statusInProgress._id.toString() === currentStatus.toString()) {
      order.status = statusToUpdate;
      return order;
    } else {
      return res.boom.badRequest(`order already ${orderStatus}`);
    }
  }
}

module.exports = OrdersService;
