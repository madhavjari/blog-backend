const { Router } = require("express");
const commentController = require("../controller/commentController");
const { commentSchema } = require("../schema/validatorSchema");
const { validate } = require("../middleware/zodValidator");
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
  validate(commentSchema),
  commentController.postComment,
);

commentRouter.delete(
  "/api/posts/:postid/:commentid",
  verifyToken,
  verifyAuthor,
  commentController.deleteComment,
);

module.exports = commentRouter;
