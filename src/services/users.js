const { User } = require('../models');
const { UserRoles } = require('../models');
const { UserStatuses } = require('../models');
const bcrypt = require('bcryptjs');

class UsersService {
  async updateUserPassword (req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await User.findOne({ _id: req.params.id }).exec();

      bcrypt.compare(oldPassword, user.password, async function (err, isMatch) {
        if (err) throw err;

        if (isMatch && oldPassword !== newPassword) {
          user.password = newPassword;
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          await user.save();
          return user ? res.json(true) : res.boom.notFound();
        } else {
          res.boom.badRequest();
        }
      });
    } catch (err) {
      res.boom.badRequest();
    }
  }

  async getStatusActive (req, res) {
    const statusActive = await UserStatuses.findOne({ name: 'Active' });
    return statusActive;
  }

  async getRoleUser (req, res) {
    const roleUser = await UserRoles.findOne({ name: 'User' });
    return roleUser;
  }

  async createUser (req, res) {
    try {
      const roleUser = await this.getRoleUser();
      const statusActive = await this.getStatusActive();
      const newUser = await new User(req.body);
      newUser.role = roleUser._id;
      newUser.status = statusActive._id;
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      const userExist = await User.findOne({ email: req.body.email });
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

      return users ? res.json(users) : [];
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

  async getRoleAdmin (req, res) {
    const roleAdmin = await UserRoles.findOne({ name: 'Admin' });
    return roleAdmin;
  }

  async createAdmin (req, res) {
    try {
      const roleAdmin = await this.getRoleAdmin();
      const statusActive = await this.getStatusActive();
      const newAdmin = await new User(req.body);
      newAdmin.role = roleAdmin._id;
      newAdmin.status = statusActive._id;
      const salt = await bcrypt.genSalt(10);
      newAdmin.password = await bcrypt.hash(newAdmin.password, salt);
      const userExist = await User.findOne({ email: req.body.email });
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

  async getStatusBlocked (req, res) {
    const statusBlocked = await UserStatuses.findOne({ name: 'Blocked' });
    return statusBlocked;
  }

  async blockUser (req, res) {
    try {
      const statusBlocked = await this.getStatusBlocked();
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: statusBlocked._id },
        {
          new: true
        }
      ).exec();
      return user ? res.json(true) : res.boom.notFound();
    } catch (err) {
      res.boom.notFound();
    }
  }

  async getStatusDeleted (req, res) {
    const statusDeleted = await UserStatuses.findOne({ name: 'Deleted' });
    return statusDeleted;
  }

  async deleteUser (req, res) {
    try {
      const statusDeleted = await this.getStatusDeleted();
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: statusDeleted._id },
        {
          new: true
        }
      ).exec();
      return user ? res.json(true) : res.boom.notFound();
    } catch (err) {
      res.boom.notFound();
    }
  }
}
module.exports = UsersService;
