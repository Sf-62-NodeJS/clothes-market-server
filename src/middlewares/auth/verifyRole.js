const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.headers.role) return res.boom.unauthorized();

    const rolesArray = [...allowedRoles];
    const result = rolesArray.includes(req.headers.role);

    if (!result) return res.boom.unauthorized();

    next();
  };
};

module.exports = verifyRole;
