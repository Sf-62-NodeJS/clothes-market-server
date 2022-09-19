const authRouter = require('express').Router();
const passport = require('passport');

// Custom authentication
authRouter.post(
  '/',
  passport.authenticate('custom', {
    successRedirect: '/',
    failureRedirect: '/auth/fail'
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
    failureRedirect: '/auth/fail'
  })
);

// Logout and fail
authRouter.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return err;
    }
  });
  req.session.destroy();
  res.redirect('/');
});

authRouter.get('/fail', (req, res) => {
  res.boom.unauthorized('Wrong email or password.');
});

module.exports = authRouter;
