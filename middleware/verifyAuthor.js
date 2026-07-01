const { findUserId, getUserByPostId } = require("../db/queries");

async function verifyAuthor(req, res, next) {
  try {
    const id = parseInt(req.params.postid);
    if (isNaN(id)) return res.status(400).json({ message: "invalid post id" });
    const username = req.user.username;
    const user = await findUserId(username);
    if (!user) return res.status(404).json({ message: "No user found" });
    const post = await getUserByPostId(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (user.id === post.userId) return next();
    return res
      .status(401)
      .json({ message: "You do not have authorization to change this post" });
  } catch (error) {
    console.error("Error in verifyAuthor middleware:", error);
    return res
      .status(500)
      .json({ message: "Internal server error checking authorization" });
  }
}

module.exports = verifyAuthor;
