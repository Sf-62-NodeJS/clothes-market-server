const ordersRouter = require('express').Router();
const { OrdersController } = require('../controllers');
const { createOrderPayloadValidator } = require('../middlewares/validators');
const { updateOrderPayloadValidator } = require('../middlewares/validators');
const { idParamValidator } = require('../middlewares/validators');
const { getOrdersQueryValidator } = require('../middlewares/validators');

const ordersController = new OrdersController();

ordersRouter.post(
  '/',
  createOrderPayloadValidator,
  ordersController.createOrder
);
ordersRouter.get('/', getOrdersQueryValidator, ordersController.getOrders);
ordersRouter.patch(
  '/:id',
  idParamValidator,
  updateOrderPayloadValidator,
  ordersController.updateOrder
);
ordersRouter.delete('/:id', idParamValidator, ordersController.deleteOrder);

module.exports = ordersRouter;
