const { checkStatus } = require("../db/queries");

async function validateAdmin(req, res, next) {
  const user = req.user.username;
  const isAdmin = await checkStatus(user);
  if (isAdmin === "admin") next();
  else {
    res.sendStatus(401);
  }
}

module.exports = validateAdmin;
