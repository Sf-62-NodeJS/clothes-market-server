const { User, UserStatuses } = require('../../models');
const { UsersService } = require('../../services');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const usersService = new UsersService();

const checkUser = async (req) => {
  const user = await User.findOne({ email: req.email }).exec();
  const status = await UserStatuses.findOne({ name: 'Active' }).exec();

  if (!user) {
    return false;
  }

  if (user.status.toString() !== status._id.toString()) {
    return 'Bad status';
  }

  return user;
};

const verifyCustom = async (req, done) => {
  const user = await checkUser(req.body);

  if (!user || user === 'Bad status') {
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

  if (user === 'Bad status') {
    return done(null, false);
  }

  if (user) {
    return done(null, {
      role: user.role,
      name: user.name.concat(` ${user.surname}`),
      id: user._id
    });
  }

  const newUserData = {
    body: {
      name: profile.given_name,
      surname: profile.family_name,
      password: profile.id,
      email: profile.email
    }
  };

  const newUser = await usersService.createUser(newUserData);

  if (newUser) {
    const user = await User.findOne({ email: profile.email }).exec();

    return user
      ? done(null, {
        role: user.role,
        name: user.name.concat(` ${user.surname}`),
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
