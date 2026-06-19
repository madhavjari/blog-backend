const { Router } = require("express");
const commentController = require("../controller/commentController");
const verifyToken = require("../middleware/verifyToken");

const commentRouter = Router();

commentRouter.get(
  "/api/posts/:postid/:commentid",
  commentController.getComment,
);

commentRouter.post(
  "/api/posts/:postid/",
  verifyToken,
  commentController.postComment,
);

module.exports = commentRouter;
