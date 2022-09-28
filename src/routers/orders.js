const ordersRouter = require('express').Router();
const { OrdersController } = require('../controllers');
const { createOrderPayloadValidator } = require('../middlewares/validators');
const { updateOrderPayloadValidator } = require('../middlewares/validators');
const { idParamValidator } = require('../middlewares/validators');
const { getOrdersQueryValidator } = require('../middlewares/validators');
const { userAuthentication } = require('../middlewares/auth');

const ordersController = new OrdersController();

ordersRouter.post(
  '/',
  createOrderPayloadValidator,
  ordersController.createOrder
);
ordersRouter.get(
  '/',
  userAuthentication('Admin', 'Super admin'),
  getOrdersQueryValidator,
  ordersController.getOrders
);
ordersRouter.patch(
  '/:id',
  userAuthentication('Admin', 'Super admin'),
  idParamValidator,
  updateOrderPayloadValidator,
  ordersController.updateOrder
);
ordersRouter.delete(
  '/:id',
  userAuthentication('Admin', 'Super admin'),
  idParamValidator,
  ordersController.deleteOrder
);

module.exports = ordersRouter;
