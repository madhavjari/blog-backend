const jwt = require("jsonwebtoken");
const { findUser } = require("../db/queries");

async function softVerifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader && bearerHeader.startsWith("Bearer ")) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    try {
      const payload = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, {
        algorithms: ["HS256"],
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
      });
      if (!payload) {
        req.user = null;
        next();
      } else {
        const user = await findUser(payload.sub);
        req.user = user;
        next();
      }
    } catch {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    next();
  }
}

module.exports = softVerifyToken;
