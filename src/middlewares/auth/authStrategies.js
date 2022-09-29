const { User, UserStatuses } = require('../../models');
const { UsersService } = require('../../services');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const usersService = new UsersService();

const checkUser = async (req) => {
  const status = await UserStatuses.findOne({ name: 'Active' }).exec();
  const user = await User.findOne({
    email: req.email,
    status: { $in: status }
  }).exec();

  return user ?? false;
};

const verifyCustom = async (req, done) => {
  const user = await checkUser(req.body);

  if (!user) {
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

  if (user) {
    return done(null, {
      role: user.role,
      name: `${user.name} ${user.surname}`,
      id: user._id
    });
  }

  request.body = {
    name: profile.given_name,
    middleName: 'Not provided',
    surname: profile.family_name,
    password: profile.id,
    phoneNumber: 'Not provided',
    address: 'Not provided',
    email: profile.email
  };

  request.isGoogleUser = true;

  await usersService.createUser(request, request.res);

  const newUser = await checkUser({ email: profile.email });

  if (newUser) {
    return done(null, {
      role: newUser.role,
      name: `${newUser.name} ${newUser.surname}`,
      id: newUser._id
    });
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
