const { Router } = require("express");
const verifyToken = require("../middleware/verifyToken");
const postController = require("../controller/postController");
const { postSchema } = require("../schema/authSchema");
const { validate } = require("../middleware/zodValidator");

const postRouter = Router();

postRouter.get("/api/posts", verifyToken, postController.getPost);
postRouter.post(
  "/api/posts",
  verifyToken,
  validate(postSchema),
  postController.postPost,
);
postRouter.post(
  "/api/posts/:postid/published",
  verifyToken,
  postController.publishPost,
);

module.exports = postRouter;
