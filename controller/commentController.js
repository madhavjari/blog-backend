const { findPost, createComment, findUserId } = require("../db/queries");

async function getComment(req, res) {
  const postId = parseInt(req.params.postid);
  const commentId = parseInt(req.params.commentid);
  console.log(postId);
  console.log(commentId);
  const post = await findPost(postId);
  console.log(post);
  if (!post)
    return res.status(404).json({
      message: "post not found",
    });
  if (!post.published)
    return res.status(401).json({
      message: "Cannot comment on unauthorized post",
    });
  const comment = await getComment(commentId, postId);
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
  const authorId = await findUserId(user);
  if (!authorId) {
    return res
      .status(401)
      .json({ error: "User authentication failed. Missing user identifier." });
  }
  const comment = await createComment({
    content,
    postId,
  });
  return res.status(200).json({
    comment,
    message: "Comment created",
  });
}

module.exports = { getComment, postComment };
