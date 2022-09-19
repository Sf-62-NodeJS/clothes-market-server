const sizesRouter = require('express').Router();
const { SizesController } = require('../controllers/');
const { userAuthentication } = require('../middlewares/auth');

const sizesController = new SizesController();

sizesRouter.post(
  '/',
  userAuthentication('Admin', 'Super admin'),
  sizesController.createSize
);
sizesRouter.put(
  '/:id',
  userAuthentication('Admin', 'Super admin'),
  sizesController.updateSize
);
sizesRouter.delete(
  '/:id',
  userAuthentication('Admin', 'Super admin'),
  sizesController.deleteSize
);
sizesRouter.get('/', sizesController.getSizes);

module.exports = sizesRouter;
