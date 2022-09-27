const { User } = require('../models');
const { UserRoles } = require('../models');
const { UserStatuses } = require('../models');
const bcrypt = require('bcryptjs');

class UsersService {
  async createUser (req, res) {
    await this.createBaseUser(req, res, 'User');
  }

  async createAdmin (req, res) {
    await this.createBaseUser(req, res, 'Admin');
  }

  async getUsers (req, res) {
    const { _id, name, email, status, role, skip, take } = req.query;

    const query = {};
    if (_id) query._id = _id;
    if (name) query.name = name;
    if (email) query.email = email;
    if (status) query.status = status;
    if (role) query.role = role;
    if (skip) query.skip = skip;
    if (take) query.take = take;

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
        return res.boom.badRequest('user already blocked');
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

  async createBaseUser (req, res, userRole) {
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
        return newUser ? res.json(true) : res.boom.notFound();
      } else {
        res.boom.badRequest('user already exists');
      }
    } catch (err) {
      res.boom.badImplementation();
    }
  }
}
module.exports = UsersService;
