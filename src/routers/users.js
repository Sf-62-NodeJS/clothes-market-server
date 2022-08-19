const usersRouter = require('express').Router();
const { UsersController } = require('../controllers');
const { createUserPayloadValidator } = require('../middlewares/validators');

const usersController = new UsersController();
usersRouter.post('/', createUserPayloadValidator, usersController.createUser);
usersRouter.post('/all_users', usersController.getUsers);
usersRouter.get('/:id', usersController.getUser);
usersRouter.delete('/delete/:id', usersController.deleteUser);
usersRouter.patch('/:id', usersController.blockUser);
usersRouter.patch('/update/:id', usersController.updateUser);

module.exports = usersRouter;
