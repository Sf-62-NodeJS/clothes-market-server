const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.userInfo.role) return res.boom.unauthorized();

    if (!allowedRoles.includes(req.userInfo.role)) { return res.boom.unauthorized(); }

    next();
  };
};

module.exports = verifyRole;
