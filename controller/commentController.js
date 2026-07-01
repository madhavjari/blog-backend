const {
  createComment,
  findUserId,
  getCommentById,
  getCommentsOfPost,
  getPostById,
  deleteCommentById,
  getUserByPostId,
  getUsernameByID,
} = require("../db/queries");

async function getComment(req, res) {
  try {
    const postId = parseInt(req.params.postid);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid Post ID format" });
    }
    const commentId = parseInt(req.params.commentid);
    if (isNaN(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID format" });
    }
    const post = await getPostById(postId);
    if (!post)
      return res.status(404).json({
        message: "post not found",
      });
    if (!post.published)
      return res.status(401).json({
        message: "Cannot see comment on unauthorized post",
      });
    const comment = await getCommentById(commentId, postId);
    if (!comment)
      return res.status(404).json({
        message: "no comment by this id",
      });
    return res.status(200).json({
      comment,
    });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllCommentsByPost(req, res) {
  try {
    const postId = parseInt(req.params.postid);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid Post ID format" });
    }
    const post = await getPostById(postId);
    if (!post) return res.status(404).json({ message: "post not found" });
    const comments = await getCommentsOfPost(postId);
    if (!comments)
      return res.status(200).json({ message: "No comments on this post" });
    const postAuthor = getUserByPostId(postId);
    if (!postAuthor) res.status(404).json({ message: "author not found" });
    const author = getUsernameByID(postAuthor.id);
    if (!author) res.status(404).json({ message: "author not found" });
    const user = req.user.username;
    if (!user || user !== author.username) {
      if (post.published) return res.status(200).json({ comments });
      else return res.status(401).json({ message: "Unathorized" });
    }
    if (user === author.username) return res.status(200).json({ comments });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteComment(req, res) {
  try {
    const commentId = parseInt(req.params.commentid);
    if (isNaN(commentId)) {
      return res.status(400).json({ error: "Invalid Comment ID format" });
    }
    await deleteCommentById(commentId);
    return res.status(200).json({
      message: "comment deleted successfully",
    });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function postComment(req, res) {
  const { content } = req.body;
  const postId = parseInt(req.params.postid);
  if (isNaN(postId)) {
    return res.status(400).json({ error: "Invalid Post ID format" });
  }
  const user = req.user.username;
  const author = await findUserId(user);
  if (!author) {
    return res
      .status(401)
      .json({ error: "User authentication failed. Missing user identifier." });
  }
  const post = await getPostById(postId);
  if (!post.published) return res.status(404).json({ error: "Post not found" });
  const authorId = author.id;
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

module.exports = {
  getComment,
  postComment,
  getAllCommentsByPost,
  deleteComment,
};
