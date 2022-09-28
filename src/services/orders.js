const { Orders, Product } = require('../models');
const { OrderStatusesService } = require('../services');

const orderStatusesService = new OrderStatusesService();

class OrdersService {
  async createOrder (req, res) {
    const orderStatus = await orderStatusesService.getStatusInProgress();
    const order = new Orders(req.body);
    order.status = orderStatus._id;
    await order.save();
    return res.json(true);
  }

  async getOrders (req, res) {
    const query = req.query;
    Object.keys(query).forEach((key) => {
      if (!query[key]) {
        delete query[key];
      }
    });

    const count = Orders.find(query).countDocuments().exec();
    const orders = await Orders.find(query)
      .skip(+query.skip || 0)
      .limit(+query.take || 50)
      .exec();

    return {
      total_size: count,
      list: orders ? res.json(orders) : res.json([])
    };
  }

  async updateOrder (req, res) {
    const order = await Orders.findOne({ _id: req.params.id }).exec();
    if (!order) return res.boom.notFound('order not found');

    const statuses = await orderStatusesService.getStatuses();
    const statusResolved = statuses.find(({ name }) => name === 'Resolved');
    const statusRejected = statuses.find(({ name }) => name === 'Rejected');
    const newStatus = req.body.orderStatus;
    const productsToAdd = req.body.productsToAdd;
    const productsToDelete = req.body.productsToDelete;

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

    if (
      newStatus &&
      (newStatus === statusResolved._id.toString() ||
        newStatus === statusRejected._id.toString())
    ) {
      const updatedOrder = await this.#updateStatus(req, res, order);
      if (updatedOrder) order.status = updatedOrder.status;
      else {
        return res.boom.badRequest('order already resolved/rejected');
      }
    }

    await Orders.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        surname: req.body.surname,
        middleName: req.body.middleName,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
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
    const statusInProgress = await orderStatusesService.getStatusInProgress();

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
    const statusInProgress = await orderStatusesService.getStatusInProgress();
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

  async #updateStatus (req, res, order) {
    const statuses = await orderStatusesService.getStatuses();
    const statusToUpdate = statuses.find(
      ({ _id }) => _id.toString() === req.body.orderStatus
    );
    const statusInProgress = statuses.find(
      ({ name }) => name === 'In progress'
    );
    const currentStatus = order.status;
    if (statusInProgress._id.toString() === currentStatus.toString()) {
      order.status = statusToUpdate;
      return order;
    } else {
      return false;
    }
  }
}

module.exports = OrdersService;
