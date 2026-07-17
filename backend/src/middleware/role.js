// Restricts a route to specific role(s), e.g. authorize('recruiter')
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden: insufficient permissions.' });
    }
    next();
  };
}

module.exports = authorize;
