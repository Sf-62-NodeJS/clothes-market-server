const { User, UserStatuses } = require('../../models');
const { UsersService } = require('../../services');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const usersService = new UsersService();

const checkUser = async (req) => {
  const user = await User.findOne({ email: req.email }).exec();

  return user ?? false;
};

const getStatus = async () => {
  const status = await UserStatuses.findOne({ name: 'Active' }).exec();

  return status;
};

const verifyCustom = async (req, done) => {
  const user = await checkUser(req.body);
  const status = await getStatus();

  if (!user || user.status.toString() !== status._id.toString()) {
    return done(null, false);
  }

  const password = await bcrypt.compare(req.body.password, user.password);

  if (!password) {
    return done(null, false);
  }

  return done(null, {
    role: user.role,
    name: user.name.concat(` ${user.surname}`),
    id: user._id
  });
};

const verifyGoogle = async (
  request,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  const user = await checkUser(profile);
  const status = await getStatus();

  if (user && user.status.toString() === status._id.toString()) {
    return done(null, {
      role: user.role,
      name: user.name.concat(` ${user.surname}`),
      id: user._id
    });
  }

  const newUserData = {
    body: {
      name: profile.given_name,
      middleName: 'Not provided',
      surname: profile.family_name,
      password: profile.id,
      phoneNumber: 'Not provided',
      address: 'Not provided',
      email: profile.email
    }
  };

  const newUser = await usersService.createBaseUser(newUserData, 'User');

  if (newUser) {
    const user = await checkUser({ email: profile.email });

    return user
      ? done(null, {
        role: user.role,
        name: `${user.name} ${user.surname}`,
        id: user._id
      })
      : done(null, false);
  }

  return done(null, false);
};

const googleSettings = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
};

module.exports = {
  verifyCustom,
  verifyGoogle,
  googleSettings
};
