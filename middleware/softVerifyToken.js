const jwt = require("jsonwebtoken");

function softVerifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader && bearerHeader.startsWith("Bearer ")) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, authData) => {
      if (err) {
        return res.sendStatus(403).json({ message: "No token" });
      }
      req.user = authData;
      next();
    });
  } else {
    next();
  }
}

module.exports = softVerifyToken;
