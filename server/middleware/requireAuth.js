const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  } else {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodedToken.userId;
      return next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired login" });
    }
  }
};
module.exports = requireAuth;
