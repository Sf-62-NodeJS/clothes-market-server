const usersRouter = require('express').Router();
const { UsersController } = require('../controllers');
const { createUserPayloadValidator } = require('../middlewares/validators');
const { updateUserPayloadValidator } = require('../middlewares/validators');

const usersController = new UsersController();
usersRouter.post('/', createUserPayloadValidator, usersController.createUser);
usersRouter.put('/:id', updateUserPayloadValidator, usersController.updateUser);
usersRouter.get('/', usersController.getUsers);
usersRouter.delete('/:id', usersController.deleteUser);

module.exports = usersRouter;
