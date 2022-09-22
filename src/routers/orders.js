const ordersRouter = require('express').Router();
const { OrdersController } = require('../controllers');
const { orderPayloadValidator } = require('../middlewares/validators');
const { idParamValidator } = require('../middlewares/validators');
const { getOrdersQueryValidator } = require('../middlewares/validators');

const ordersController = new OrdersController();

ordersRouter.post('/', orderPayloadValidator, ordersController.createOrder);
ordersRouter.get('/', getOrdersQueryValidator, ordersController.getOrders);
ordersRouter.patch(
  '/:id',
  idParamValidator,
  orderPayloadValidator,
  ordersController.updateOrder
);
ordersRouter.delete('/:id', idParamValidator, ordersController.deleteOrder);
ordersRouter.patch(
  '/resolve/:id',
  idParamValidator,
  ordersController.resolveOrder
);
ordersRouter.patch(
  '/reject/:id',
  idParamValidator,
  ordersController.rejectOrder
);

module.exports = ordersRouter;
