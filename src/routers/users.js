const usersRouter = require('express').Router();
const { UsersController } = require('../controllers');
const { createUserPayloadValidator } = require('../middlewares/validators');
const { updateUserPayloadValidator } = require('../middlewares/validators');
const {
  updateUserPasswordPayloadValidator,
  addProductToCartPayloadValidator
} = require('../middlewares/validators');
const { userAuthentication } = require('../middlewares/auth');
const { idParamValidator } = require('../middlewares/validators');
const { getUsersQueryValidator } = require('../middlewares/validators');

const usersController = new UsersController();
usersRouter.post('/', createUserPayloadValidator, usersController.createUser);
usersRouter.put(
  '/:id',
  userAuthentication('User', 'Admin', 'Super admin'),
  idParamValidator,
  updateUserPayloadValidator,
  usersController.updateUser
);
usersRouter.get('/', userAuthentication('Admin', 'Super admin'), getUsersQueryValidator, usersController.getUsers);

usersRouter.patch(
  '/password/:id',
  userAuthentication('User', 'Admin', 'Super admin'),
  idParamValidator,
  updateUserPasswordPayloadValidator,
  usersController.updateUserPassword
);
usersRouter.post(
  '/admin',
  userAuthentication('Super admin'),
  createUserPayloadValidator,
  usersController.createAdmin
);
usersRouter.patch('/block/:id', userAuthentication('Admin', 'Super admin'), idParamValidator, usersController.blockUser);
usersRouter.patch('/delete/:id', userAuthentication('Admin', 'Super admin'), idParamValidator, usersController.deleteUser);

usersRouter.post(
  '/cart',
  userAuthentication('User', 'Admin', 'Super admin'),
  addProductToCartPayloadValidator,
  usersController.addProducts
);
usersRouter.delete(
  '/cart/:id',
  userAuthentication('User', 'Admin', 'Super admin'),
  usersController.deleteProducts
);
usersRouter.get(
  '/cart/',
  userAuthentication('User', 'Admin', 'Super admin'),
  usersController.getProducts
);

module.exports = usersRouter;
