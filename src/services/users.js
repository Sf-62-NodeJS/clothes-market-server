const { User } = require('../models');
const { UserRoles } = require('../models');
const { UserStatuses } = require('../models');
const bcrypt = require('bcryptjs');

class UsersService {
  async updateUserPassword (req, res) {
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
  }

  async getStatusActive (req, res) {
    const activeStatus = await UserStatuses.findOne({ name: 'Active' });
    return activeStatus;
  }

  async getRoleUser (req, res) {
    const userRole = await UserRoles.findOne({ name: 'User' });
    return userRole;
  }

  async createUser (req, res) {
    const roleUser = await this.getRoleUser();
    const statusActive = await this.getStatusActive();
    const newUser = await new User(req.body);
    newUser.role = roleUser._id;
    newUser.status = statusActive._id;
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    await newUser.save();

    return newUser ? res.json(true) : res.boom.notFound();
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

    const users = await User.find(query)
      .select('-password')
      .skip(+query.skip || 0)
      .limit(+query.take || 50)
      .exec();

    return users ? res.json(users) : [];
  }

  async updateUser (req, res) {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).exec();
    return updated ? res.json(true) : res.boom.notFound();
  }

  async getRoleAdmin (req, res) {
    const userRole = await UserRoles.findOne({ name: 'Admin' });
    return userRole;
  }

  async createAdmin (req, res) {
    const roleAdmin = await this.getRoleAdmin();
    const statusActive = await this.getStatusActive();
    const newAdmin = await new User(req.body);
    newAdmin.role = roleAdmin._id;
    newAdmin.status = statusActive._id;
    const salt = await bcrypt.genSalt(10);
    newAdmin.password = await bcrypt.hash(newAdmin.password, salt);
    await newAdmin.save();

    return newAdmin ? res.json(true) : res.boom.notFound();
  }

  async getStatusBlocked (req, res) {
    const activeStatus = await UserStatuses.findOne({ name: 'Blocked' });
    return activeStatus;
  }

  async blockUser (req, res) {
    const statusBlocked = await this.getStatusBlocked();
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: statusBlocked._id },
      {
        new: true
      }
    ).exec();
    return user ? res.json(true) : res.boom.notFound();
  }

  async getStatusDeleted (req, res) {
    const activeStatus = await UserStatuses.findOne({ name: 'Deleted' });
    return activeStatus;
  }

  async deleteUser (req, res) {
    const statusDeleted = await this.getStatusDeleted();
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: statusDeleted._id },
      {
        new: true
      }
    ).exec();
    return user ? res.json(true) : res.boom.notFound();
  }
}
module.exports = UsersService;
