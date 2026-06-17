const jwt = require("jsonwebtoken");

function verifyLoggedIn(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader && bearerHeader.startsWith("Bearer ")) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err) => {
      if (err) {
        return next();
      }
      return res.status(404).json({ message: "Already Logged in" });
    });
  } else {
    return next();
  }
}

module.exports = verifyLoggedIn;
