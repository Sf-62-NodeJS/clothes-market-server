const usersRouter = require('express').Router();
const { UsersController } = require('../controllers');
const { createUserPayloadValidator } = require('../middlewares/validators');
const { updateUserPayloadValidator } = require('../middlewares/validators');
const {
  updateUserPasswordPayloadValidator
} = require('../middlewares/validators');
const { userAuthentication } = require('../middlewares/auth');

const usersController = new UsersController();
usersRouter.post('/', createUserPayloadValidator, usersController.createUser);
usersRouter.put(
  '/:id',
  userAuthentication('User', 'Admin', 'Super admin'),
  updateUserPayloadValidator,
  usersController.updateUser
);
usersRouter.get(
  '/',
  userAuthentication('Admin', 'Super admin'),
  usersController.getUsers
);
usersRouter.patch(
  '/password/:id',
  userAuthentication('User', 'Admin', 'Super admin'),
  updateUserPasswordPayloadValidator,
  usersController.updateUserPassword
);
usersRouter.post(
  '/admin',
  userAuthentication('Super admin'),
  createUserPayloadValidator,
  usersController.createAdmin
);
usersRouter.patch(
  '/block/:id',
  userAuthentication('Admin', 'Super admin'),
  usersController.blockUser
);
usersRouter.patch(
  '/delete/:id',
  userAuthentication('Admin', 'Super admin'),
  usersController.deleteUser
);

module.exports = usersRouter;
