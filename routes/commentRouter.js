const { Router } = require("express");
const commentController = require("../controller/commentController");
const verifyToken = require("../middleware/verifyToken");
const verifyAuthor = require("../middleware/verifyAuthor");
const softVerifyToken = require("../middleware/softVerifyToken");

const commentRouter = Router();
commentRouter.get(
  "/api/posts/:postid/comments",
  softVerifyToken,
  commentController.getAllCommentsByPost,
);

commentRouter.get(
  "/api/posts/:postid/:commentid",
  commentController.getComment,
);

commentRouter.post(
  "/api/posts/:postid/",
  verifyToken,
  commentController.postComment,
);

commentRouter.delete(
  "/api/posts/:postid/:commentid",
  verifyToken,
  verifyAuthor,
  commentController.deleteComment,
);

module.exports = commentRouter;
