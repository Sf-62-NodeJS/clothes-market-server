const jwt = require('jsonwebtoken');
require('dotenv').config();

const userAuthenticateJWS = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.boom.badRequest('No token found.');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      res.boom.badRequest(`Authorization error: ${err}`);
    }

    req.userInfo = userInfo;

    next();
  });
};

module.exports = userAuthenticateJWS;
