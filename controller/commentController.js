const {
  findPost,
  createComment,
  findUserId,
  getCommentById,
} = require("../db/queries");

async function getComment(req, res) {
  const postId = parseInt(req.params.postid);
  const commentId = parseInt(req.params.commentid);
  const post = await findPost(postId);
  if (!post)
    return res.status(404).json({
      message: "post not found",
    });
  if (!post.published)
    return res.status(401).json({
      message: "Cannot comment on unauthorized post",
    });
  console.log(postId);
  const comment = await getCommentById(commentId, postId);
  console.log(comment);
  if (!comment)
    return res.status(404).json({
      message: "no comment by this id",
    });
  return res.status(200).json({
    comment,
  });
}

async function postComment(req, res) {
  const { content } = req.body;
  const postId = parseInt(req.params.postid);
  const user = req.user.username;
  const author = await findUserId(user);
  if (!author) {
    return res
      .status(401)
      .json({ error: "User authentication failed. Missing user identifier." });
  }
  const post = await findPost(postId);
  if (!post.published) return res.status(404).json({ error: "Post not found" });
  const authorId = parseInt(author.id);
  const comment = await createComment({
    content,
    postId,
    authorId,
  });
  return res.status(200).json({
    comment,
    message: "Comment created",
  });
}

module.exports = { getComment, postComment };
