const sizesRouter = require('express').Router();
const { SizesController } = require('../controllers/');

const sizesController = new SizesController();

sizesRouter.post('/', sizesController.createSize);
sizesRouter.put('/:id', sizesController.updateSize);
sizesRouter.delete('/:id', sizesController.deleteSize);
sizesRouter.get('/', sizesController.getSizes);

module.exports = sizesRouter;
