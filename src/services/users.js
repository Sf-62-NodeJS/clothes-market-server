const { User } = require('../models');
const { UserRoles } = require('../models');
const { UserStatuses } = require('../models');
const bcrypt = require('bcryptjs');

class UsersService {
  async createUser (req, res) {
    try {
      const userExist = await this.checkUserExists(req);
      if (!userExist) {
        const roleUser = await this.getRole('User');
        const newUser = await this.createBasicUser(req);
        newUser.role = roleUser._id;
        await newUser.save();
        return newUser ? res.json(true) : res.boom.notFound();
      } else {
        res.boom.badRequest('user already exists');
      }
    } catch (err) {
      res.boom.badRequest();
    }
  }

  async createAdmin (req, res) {
    try {
      const userExist = await this.checkUserExists(req);
      if (!userExist) {
        const roleAdmin = await this.getRole('Admin');
        const newAdmin = await this.createBasicUser(req);
        newAdmin.role = roleAdmin._id;
        await newAdmin.save();
        return newAdmin ? res.json(true) : res.boom.notFound();
      } else {
        res.boom.badRequest('user already exists');
      }
    } catch (err) {
      res.boom.badRequest();
    }
  }

  async getUsers (req, res) {
    const { _id, name, email, status, role, skip, take } =
      (typeof req.query !== 'undefined' && req.query) || {};
    const query = {};
    if (_id != null) query._id = _id;
    if (name != null) query.name = name;
    if (email != null) query.email = email;
    if (status != null) query.status = status;
    if (role != null) query.role = role;
    if (skip != null) query.skip = skip;
    if (take != null) query.take = take;

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
      return res.boom.badRequest();
    }
  }

  async updateUser (req, res) {
    try {
      const currentStatus = await this.getCurrentStatus(req);
      const statusActive = await this.getStatus('Active');
      if (currentStatus.toString() === statusActive._id.toString()) {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
          new: true
        }).exec();
        return updated ? res.json(true) : res.boom.notFound();
      } else {
        res.boom.badRequest('user is not active');
      }
    } catch (err) {
      return res.boom.notFound();
    }
  }

  async updateUserPassword (req, res) {
    try {
      const currentStatus = await this.getCurrentStatus(req);
      const statusActive = await this.getStatus('Active');
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
          );
          return updatedUserPassword ? res.json(true) : res.boom.notFound();
        } else {
          res.boom.badRequest('new password cannot be the same as old');
        }
      }
    } catch {
      res.boom.notFound();
    }
  }

  async blockUser (req, res) {
    try {
      const statusBlocked = await this.getStatus('Blocked');
      const currentStatus = await this.getCurrentStatus(req);
      if (statusBlocked._id.toString() !== currentStatus.toString()) {
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
      res.boom.notFound();
    }
  }

  async deleteUser (req, res) {
    try {
      const statusDeleted = await this.getStatus('Deleted');
      const currentStatus = await this.getCurrentStatus(req);
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
      res.boom.notFound();
    }
  }

  async createBasicUser (req, res) {
    const statusActive = await this.getStatus('Active');
    const newUser = new User(req.body);
    newUser.status = statusActive._id;
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    return newUser;
  }

  async checkUserExists (req, res) {
    const userExist = User.findOne({ email: req.body.email });
    return userExist;
  }

  async getStatus (statusName) {
    const status = await UserStatuses.findOne({ name: statusName }).exec();
    return status;
  }

  async getRole (roleName) {
    const role = await UserRoles.findOne({ name: roleName }).exec();
    return role;
  }

  async getCurrentStatus (req, res) {
    const user = await User.findOne({ _id: req.params.id }).exec();
    return user.status;
  }
}
module.exports = UsersService;
