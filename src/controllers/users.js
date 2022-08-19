const { User } = require('../models');

const PAGE_NUMBER = 1;
const DOCS_NUMBER = 50;

class UsersController {
  async getUser (req, res) {
    const user = await User.findById(req.params.id).exec();

    return user ? res.json(user) : res.boom.notFound();
  }

  async createUser (req, res) {
    const newUser = await new User(req.body).save();

    return res.json(newUser);
  }

  async deleteUser (req, res) {
    try {
      await User.deleteOne({ _id: req.params.id }).exec();

      return res.status(200).json({ message: 'User is deleted.' });
    } catch (error) {
      res.status(400).json({ err: error });
    }
  }

  async getUsers (req, res) {
    const { _id, name, email, status, role, page, docs } = req.body;
    const query = {};
    if (_id != null) query._id = _id;
    if (name != null) query.name = name;
    if (email != null) query.email = email;
    if (status != null) query.status = status;
    if (role != null) query.role = role;
    const pageNumber = page || PAGE_NUMBER;
    const docsNumber = docs || DOCS_NUMBER;

    try {
      const users = await User.find(query)
        .skip((pageNumber - 1) * docsNumber)
        .limit(docsNumber)
        .exec();

      return users ? res.json(users) : res.boom.notFound();
    } catch (error) {
      res.status(400).json({ err: error });
    }
  }

  async blockUser (req, res) {
    try {
      const user = await User.findById(req.params.id).exec();
      user.status = 'blocked';
      await user.save();
      return res.status(200).json({ message: 'User is blocked.' });
    } catch (error) {
      res.status(400).json({ err: error });
    }
  }

  async updateUser (req, res) {
    const { name, surname, middleName, email, phoneNumber } = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          name,
          surname,
          middleName,
          email,
          phoneNumber
        },
        { new: true }
      ).exec();
      console.log(updatedUser);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ err: error });
    }
  }
}

module.exports = UsersController;
