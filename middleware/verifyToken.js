const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader && bearerHeader.startsWith("Bearer ")) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, authData) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = authData;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports = verifyToken;
