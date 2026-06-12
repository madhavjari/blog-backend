const { findUserId, getUserByPostId } = require("../db/queries");

async function verifyAuthor(req, res, next) {
  const id = parseInt(req.params.postid);
  const user = req.user.username;
  const userId = await findUserId(user);
  const postUserId = await getUserByPostId(id);

  if (userId === postUserId) next();
  else {
    return res
      .sendStatus(401)
      .json({ message: "You do not have authorization to change this post" });
  }
}

module.exports = verifyAuthor;
