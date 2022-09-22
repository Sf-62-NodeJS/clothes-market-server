const { User } = require('../models');
const { UserRoles } = require('../models');
const { UserStatuses } = require('../models');
const { Product } = require('../models');
const bcrypt = require('bcryptjs');
const { ProductsService } = require('../services');

class UsersService {
  #productService = new ProductsService();

  async createUser (req, res) {
    await this.#createBaseUser(req, res, 'User');
  }

  async createAdmin (req, res) {
    await this.#createBaseUser(req, res, 'Admin');
  }

  async getUsers (req, res) {
    const query = req.query;
    Object.keys(query).forEach((key) => {
      if (!query[key]) {
        delete query[key];
      }
    });

    try {
      const users = await User.find(query)
        .select('-password')
        .skip(+query.skip || 0)
        .limit(+query.take || 50)
        .exec();

      const count = await User.find(query).countDocuments().exec();

      return {
        total_size: count,
        list: users ? res.json(users) : res.json([])
      };
    } catch (err) {
      return res.boom.badImplementation();
    }
  }

  async updateUser (req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id }).exec();
      if (!user) return res.boom.notFound();
      const currentStatus = user.status;
      const statusActive = await UserStatuses.findOne({
        name: 'Active'
      }).exec();
      if (currentStatus.toString() === statusActive._id.toString()) {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
          new: true
        }).exec();
        return updated ? res.json(true) : res.boom.notFound();
      } else {
        res.boom.badRequest('user is not active');
      }
    } catch (err) {
      return res.boom.badImplementation();
    }
  }

  async updateUserPassword (req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id }).exec();
      if (!user) return res.boom.notFound();
      const currentStatus = user.status;
      const statusActive = await UserStatuses.findOne({
        name: 'Active'
      }).exec();
      if (currentStatus.toString() === statusActive._id.toString()) {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findOne({ _id: req.params.id }).exec();
        const isMatchPasswords = await bcrypt.compare(
          oldPassword,
          user.password
        );
        if (!isMatchPasswords) {
          return res.boom.badRequest('wrong old password');
        }
        if (isMatchPasswords && oldPassword !== newPassword) {
          user.password = newPassword;
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          const updatedUserPassword = User.findOneAndUpdate(
            { _id: req.params.id },
            user
          ).exec();
          return updatedUserPassword ? res.json(true) : res.boom.notFound();
        } else {
          res.boom.badRequest('new password cannot be the same as old');
        }
      } else {
        res.boom.badRequest('user is not active');
      }
    } catch {
      res.boom.badImplementation();
    }
  }

  async blockUser (req, res) {
    try {
      const statuses = await UserStatuses.find().exec();
      const statusBlocked = statuses.find(({ name }) => name === 'Blocked');
      const statusDeleted = statuses.find(({ name }) => name === 'Deleted');
      const user = await User.findOne({ _id: req.params.id }).exec();
      if (!user) return res.boom.notFound();
      const currentStatus = user.status;
      if (
        statusBlocked._id.toString() !== currentStatus.toString() &&
        statusDeleted._id.toString() !== currentStatus.toString()
      ) {
        const user = await User.findByIdAndUpdate(
          req.params.id,
          { status: statusBlocked._id },
          {
            new: true
          }
        ).exec();
        return user ? res.json(true) : res.boom.notFound();
      } else {
        return res.boom.badRequest('user is not active');
      }
    } catch (err) {
      res.boom.badImplementation();
    }
  }

  async deleteUser (req, res) {
    try {
      const statusDeleted = await UserStatuses.findOne({
        name: 'Deleted'
      }).exec();
      const user = await User.findOne({ _id: req.params.id }).exec();
      if (!user) return res.boom.notFound();
      const currentStatus = user.status;
      if (statusDeleted._id.toString() !== currentStatus.toString()) {
        const user = await User.findByIdAndUpdate(
          req.params.id,
          { status: statusDeleted._id },
          {
            new: true
          }
        ).exec();
        return user ? res.json(true) : res.boom.notFound();
      } else {
        return res.boom.badRequest('user already deleted');
      }
    } catch (err) {
      res.boom.badImplementation();
    }
  }

  async #createBaseUser (req, res, userRole) {
    try {
      const statuses = await UserStatuses.find().exec();
      const statusActive = statuses.find(({ name }) => name === 'Active');
      const statusDeleted = statuses.find(({ name }) => name === 'Deleted');

      const users = await User.find({ email: req.body.email }).exec();
      const activeUser = users.find(
        (user) => user.status.toString() === statusActive._id.toString()
      );
      const deletedUser = users.find(
        (user) => user.status.toString() === statusDeleted._id.toString()
      );

      if (!users.length || (deletedUser && !activeUser)) {
        const newUser = new User(req.body);
        newUser.status = statusActive._id;
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        const roleUser = await UserRoles.findOne({ name: userRole }).exec();
        newUser.role = roleUser._id;
        await newUser.save();

        if (newUser && req.isGoogleUser) return true;

        return newUser ? res.json(true) : res.boom.notFound();
      } else {
        return req.isGoogleUser
          ? false
          : res.boom.badRequest('user already exists');
      }
    } catch (err) {
      res.boom.badImplementation();
    }
  }

  async addProducts (req, res) {
    try {
      const user = await User.findById(req.session.passport.user.id).exec();
      if (!user) {
        return res.boom.notFound('User not found');
      }

      const reqProduct = await this.#productService.findById(
        req.body.productId
      );
      if (!reqProduct) {
        return res.boom.badRequest('Product does not exist');
      }
      if (
        !reqProduct.sizes.some(
          (sizeId) => String(sizeId) === String(req.body.sizeId)
        )
      ) {
        return res.boom.badRequest('Product not available in this size');
      }
      const userCart = user.cart;
      const productInCart = userCart.find(
        (element) =>
          String(element.productId) === String(req.body.productId) &&
          String(element.sizeId) === String(req.body.sizeId)
      );
      if (productInCart) {
        await User.updateOne(
          {
            _id: req.session.passport.user.id,
            'cart.productId': req.body.productId,
            'cart.sizeId': req.body.sizeId
          },
          {
            $set: {
              'cart.$.quantity': productInCart.quantity + req.body.quantity
            }
          }
        ).exec();
      } else {
        await User.updateOne(
          { _id: req.session.passport.user.id },
          { $push: { cart: req.body } }
        ).exec();
      }
      return res.json(true);
    } catch (err) {
      return res.boom.badImplementation(err);
    }
  }

  async #findProductsByQuery (reqQuery, user) {
    const cart = user.cart;

    const query = {};
    if (reqQuery.id) query._id = reqQuery.id;
    if (reqQuery.productId) query.productId = reqQuery.productId;
    if (reqQuery.sizeId) query.sizeId = reqQuery.sizeId;
    if (reqQuery.quantity) query.quantity = reqQuery.quantity;

    const results = cart.filter((product) => {
      for (const prop in query) {
        if (String(product[prop]) !== String(query[prop])) {
          return false;
        }
      }
      return true;
    });
    return results;
  }

  async deleteProducts (req, res) {
    try {
      const user = await User.findById(req.session.passport.user.id).exec();
      if (!user) {
        return res.boom.notFound('User not found');
      }
      const cardItems = await this.#findProductsByQuery(req.body, user);
      if (!cardItems.length) {
        return res.boom.notFound('No items with these parameters found.');
      }
      const product = await User.findByIdAndUpdate(
        req.session.passport.user.id,
        {
          $pull: {
            cart: req.body
          }
        }
      ).exec();
      return product
        ? res.json(true)
        : res.boom.badRequest('An error occured while deleting product');
    } catch (err) {
      return res.boom.badImplementation(err);
    }
  }

  async getProducts (req, res) {
    try {
      const user = await User.findById(req.session.passport.user.id).exec();
      if (!user) {
        return res.boom.notFound('User not found');
      }
      const cartItems = await this.#findProductsByQuery(req.query, user);
      if (!cartItems.length) {
        return res.boom.notFound('No card items found');
      }
      return res.json(cartItems);
    } catch (err) {
      return res.boom.badImplementation(err);
    }
  }
}
module.exports = UsersService;
