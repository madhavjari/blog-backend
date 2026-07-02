const jwt = require("jsonwebtoken");
const { findUser } = require("../db/queries");

async function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  try {
    const payload = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, {
      algorithms: ["HS256"],
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });
    const user = await findUser(payload.sub);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Wrong token" });
  }
}

module.exports = verifyToken;
