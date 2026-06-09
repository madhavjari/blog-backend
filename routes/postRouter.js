const { Router } = require("express");
const verifyToken = require("../middleware/verifyToken");
const postController = require("../controller/postController");

const postRouter = Router();

postRouter.get("/api/posts", verifyToken, postController.getPost);
postRouter.post("/api/posts", verifyToken, postController.postPost);
postRouter.post(
  "/api/posts/:postid/published",
  verifyToken,
  postController.publishPost,
);

module.exports = postRouter;
