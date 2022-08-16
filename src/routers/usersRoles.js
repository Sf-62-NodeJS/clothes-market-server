const usersRolesRouter = require('express').Router();
const { UsersRolesController } = require('../controllers');

const usersRolesController = new UsersRolesController();
usersRolesRouter.get('/:id', usersRolesController.getRole);

module.exports = usersRolesRouter;
