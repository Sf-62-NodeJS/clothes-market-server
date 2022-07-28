const usersRouter = require('express').Router();
const { UsersController } = require('../controllers');
const { createUserPayloadValidator } = require('../middlewares/validators');

const usersController = new UsersController();
usersRouter.post('/', createUserPayloadValidator, usersController.createUser);
usersRouter.get('/:id', usersController.getUser);

module.exports = usersRouter;
