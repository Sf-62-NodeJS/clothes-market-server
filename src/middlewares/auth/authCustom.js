const { User, UserStatuses, UserRoles } = require('../../models');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const CustomStrategy = require('passport-custom').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();

const verify = async (req, done) => {
  const checkUser = await User.findOne({ email: req.body.email }).exec();

  if (!checkUser) {
    return done(null, false);
  }

  const status = await UserStatuses.findOne({ name: 'Active' }).exec();

  if (!(checkUser.status.toString() === status._id.toString())) {
    return done(null, false);
  }

  const result = await bcrypt.compare(req.body.password, checkUser.password);

  if (!result) {
    done(null, false);
  }

  const user = JSON.parse(JSON.stringify(checkUser));
  delete user.password;
  delete user.address;
  delete user.phoneNumber;
  delete user.orders;

  done(null, user);
};

passport.use('custom', new CustomStrategy(verify));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
      passReqToCallback: true
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const role = await UserRoles.findOne({ name: 'User' }).exec();

      profile.role = role._id.toString();
      profile.name = profile.displayName;

      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
