const JWT = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  JWT.verify(token, process.env?.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.error("Token has expired");
        next(new Error("Token has expired"));
      } else if (err.name === "JsonWebTokenError") {
        console.error("Invalid token");
        next(new Error("Invalid token"));
      }
      return;
    }
    req.user = decoded;
  });

  next();
};

module.exports = authMiddleware;
