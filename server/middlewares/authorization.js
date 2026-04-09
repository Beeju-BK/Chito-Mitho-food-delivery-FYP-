export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Make sure JWT middleware ran first and set req.user
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user's role is in the allowedRoles array
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next(); // user has proper role, continue
  };
};