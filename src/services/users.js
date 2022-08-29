const { User } = require('../models');

class UsersService {
  async createUser (req, res) {
    const newUser = await new User(req.body).save();

    return res.json(newUser);
  }

  async deleteUser (req, res) {
    const deleted = await User.findByIdAndDelete(req.params.id).exec();

    return deleted ? res.json(true) : res.boom.notFound();
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
    console.log(query);

    const users = await User.find(query)
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
}
module.exports = UsersService;
