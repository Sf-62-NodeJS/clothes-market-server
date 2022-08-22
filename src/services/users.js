const { User } = require('../models');

class UsersService {
  async getUser (req, res) {
    const user = await User.findById(req.params.id).exec();

    return user ? res.json(user) : res.boom.notFound();
  }

  async createUser (req, res) {
    const newUser = await new User(req.body).save();

    return res.json(newUser);
  }
}

module.exports = UsersService;
