const { User, UserStatuses, UserRoles } = require('../../models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const verifyCustom = async (req, done) => {
  const user = await User.findOne({ email: req.body.email }).exec();
  const status = await UserStatuses.findOne({ name: 'Active' }).exec();

  if (!user || user.status.toString() === status._id.toString()) {
    return done(null, false);
  }

  const password = await bcrypt.compare(req.body.password, user.password);

  if (!password) {
    done(null, false);
  }

  done(null, { role: user.role, name: user.name.concat(` ${user.surname}`) });
};

const verifyGoogle = async (
  request,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  const role = await UserRoles.findOne({ name: 'User' }).exec();

  profile.role = role._id.toString();
  profile.name = profile.displayName;

  return done(null, profile);
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
