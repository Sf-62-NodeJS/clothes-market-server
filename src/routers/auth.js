const authRouter = require('express').Router();
const passport = require('passport');

require('../middlewares/auth/authCustom');

// Custom authentication
authRouter.post(
  '/login',
  passport.authenticate('custom', {
    successRedirect: '/',
    failureRedirect: '/auth/failure'
  })
);

// Google authentication
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);

// Logout
authRouter.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return err;
    }
  });
  req.session.destroy();
  res.redirect('/');
});

module.exports = authRouter;
