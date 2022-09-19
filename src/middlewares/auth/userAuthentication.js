const { UserRoles } = require('../../models');

const userAuthentication = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.session.passport) return res.boom.unauthorized();

    const userRoles = await UserRoles.find({
      name: { $in: allowedRoles }
    }).exec();

    for (const role of userRoles) {
      if (role._id.toString() === req.session.passport.user.role) return next();
    }

    return res.boom.unauthorized();
  };
};

module.exports = userAuthentication;
