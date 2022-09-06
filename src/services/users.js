const { User } = require('../models');
const { UserRoles } = require('../models');
const { UserStatuses } = require('../models');
const bcrypt = require('bcryptjs');

class UsersService {
  async updateUserPassword (req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await User.findOne({ _id: req.params.id }).exec();

      return bcrypt.compare(
        oldPassword,
        user.password,
        async function (err, isMatch) {
          if (err) throw err;
          if (!isMatch) return res.boom.badRequest('wrong old password');
          if (oldPassword !== newPassword) {
            user.password = newPassword;
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
            return user ? res.json(true) : res.boom.notFound();
          } else {
            res.boom.badRequest('new password cannot be the same as old');
          }
        }
      );
    } catch (err) {
      res.boom.notFound();
    }
  }

  async getStatusActive () {
    const statusActive = await UserStatuses.findOne({ name: 'Active' });
    return statusActive;
  }

  async getRoleUser () {
    const roleUser = await UserRoles.findOne({ name: 'User' });
    return roleUser;
  }

  async createBasicUser (req, res) {
    const statusActive = await this.getStatusActive();
    const newUser = await new User(req.body);
    newUser.status = statusActive._id;
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    return newUser;
  }

  async checkUserExists (req, res) {
    const userExist = await User.findOne({ email: req.body.email });
    return userExist;
  }

  async createUser (req, res) {
    try {
      const roleUser = await this.getRoleUser();
      const newUser = await this.createBasicUser(req);
      newUser.role = roleUser._id;
      const userExist = await this.checkUserExists(req);
      if (!userExist) {
        await newUser.save();
        return newUser ? res.json(true) : res.boom.notFound();
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

      const count = User.find(query).count();

      return {
        total_number: count,
        allusers: users ? res.json(users) : res.json([])
      };
    } catch (err) {
      return res.boom.badRequest();
    }
  }

  async updateUser (req, res) {
    try {
      const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      }).exec();
      return updated ? res.json(true) : res.boom.notFound();
    } catch (err) {
      return res.boom.notFound();
    }
  }

  async getRoleAdmin () {
    const roleAdmin = await UserRoles.findOne({ name: 'Admin' });
    return roleAdmin;
  }

  async createAdmin (req, res) {
    try {
      const roleAdmin = await this.getRoleAdmin();
      const newAdmin = await this.createBasicUser(req);
      newAdmin.role = roleAdmin._id;
      const userExist = await this.checkUserExists(req);
      if (!userExist) {
        await newAdmin.save();
        return newAdmin ? res.json(true) : res.boom.notFound();
      } else {
        res.boom.badRequest('user already exists');
      }
    } catch (err) {
      res.boom.badRequest();
    }
  }

  async getStatusBlocked () {
    const statusBlocked = await UserStatuses.findOne({ name: 'Blocked' });
    return statusBlocked;
  }

  async getCurrentStatus (req, res) {
    const user = await User.findOne({ _id: req.params.id });
    return user.status;
  }

  async blockUser (req, res) {
    try {
      const statusBlocked = await this.getStatusBlocked();
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

  async getStatusDeleted () {
    const statusDeleted = await UserStatuses.findOne({ name: 'Deleted' });
    return statusDeleted;
  }

  async deleteUser (req, res) {
    try {
      const statusDeleted = await this.getStatusDeleted();
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
}
module.exports = UsersService;
