const { Router } = require("express");
const verifyToken = require("../middleware/verifyToken");
const postController = require("../controller/postController");
const { postSchema } = require("../schema/authSchema");
const { validate } = require("../middleware/zodValidator");
const validateAdmin = require("../middleware/validateAdmin");

const postRouter = Router();

postRouter.get("/api/posts", postController.getPost);

postRouter.get("/api/posts/:username", verifyToken, postController.getUserPost);

postRouter.get(
  "/api/admin",
  verifyToken,
  validateAdmin,
  postController.getAdmin,
);

postRouter.get("/api/posts/:id", postController.getUniquePost);

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
