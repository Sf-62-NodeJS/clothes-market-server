const ordersRouter = require('express').Router();
const { OrdersController } = require('../controllers');

const ordersController = new OrdersController();

ordersRouter.post('/', ordersController.createOrder);
ordersRouter.get('/', ordersController.getOrders);
ordersRouter.patch('/:id', ordersController.updateOrder);
ordersRouter.delete('/:id', ordersController.deleteOrder);
ordersRouter.patch('/resolve/:id', ordersController.resolveOrder);
ordersRouter.patch('/reject/:id', ordersController.rejectOrder);

module.exports = ordersRouter;
