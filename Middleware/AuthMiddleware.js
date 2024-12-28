const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // Check for token in Authorization header or cookies
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, "private-key");
    req.user = decoded;
    next(); // Token is valid, proceed to the next middleware
  } catch (error) {
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};

module.exports = { authenticate };
