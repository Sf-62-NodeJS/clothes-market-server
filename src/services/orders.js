const { Orders, Product, ProductStatuses } = require('../models');
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
    const statuses = await orderStatusesService.getStatuses();
    const order = await Orders.findOne({
      _id: req.params.id,
      status: statuses.find(({ name }) => name === 'In progress')._id
    }).exec();

    if (!order) {
      return res.boom.notFound(
        'Order not found or it is already resolved or rejected'
      );
    }

    const newStatus = statuses.find(
      ({ _id }) => _id.toString() === req.body.orderStatus
    );
    const statusInBody = req.body.orderStatus;

    if (statusInBody && !newStatus) {
      return res.boom.notFound('status does not exist');
    }

    const productsToAdd = req.body.productsToAdd;
    const productsToDelete = req.body.productsToDelete;

    if (statusInBody && (productsToAdd || productsToDelete)) {
      return res.boom.badRequest(
        'cannot add/remove products and change status at the same time'
      );
    }

    if (productsToAdd) {
      const updatedOrder = await this.#addProductsToOrder(req, res, order);
      if (updatedOrder) order.products = updatedOrder.products;
      else {
        return res.boom.notFound(
          'cannot add a product that does not exist or is with status non available'
        );
      }
    }

    if (productsToDelete) {
      const updatedOrder = await this.#deleteProductsFromOrder(req, res, order);
      if (updatedOrder) order.products = updatedOrder.products;
      else {
        return res.boom.notFound('cannot delete a product that does not exist');
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
        status: req.body.orderStatus
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
    const statusAvailable = await ProductStatuses.findOne({
      name: 'Available'
    }).exec();
    const allProducts = await Product.find({
      _id: { $in: req.body.productsToAdd },
      status: { $in: statusAvailable._id }
    }).exec();
    for (const product of req.body.productsToAdd) {
      const productFound = allProducts.find(
        ({ _id }) => _id.toString() === product
      );
      if (!productFound) return false;
    }
    order.products.push(...req.body.productsToAdd);
    return order;
  }

  async #deleteProductsFromOrder (req, res, order) {
    const productsToDelete = req.body.productsToDelete;
    for (const product of req.body.productsToDelete) {
      const found = productsToDelete.find((p) => p === product);
      const index = order.products.indexOf(found);
      if (index > -1) order.products.splice(index, 1);
      else return false;
    }
    return order;
  }
}

module.exports = OrdersService;
