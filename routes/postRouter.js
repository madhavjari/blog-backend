const { Router } = require("express");
const verifyToken = require("../middleware/verifyToken");
const postController = require("../controller/postController");
const { postSchema } = require("../schema/validatorSchema");
const { validate } = require("../middleware/zodValidator");
const validateAdmin = require("../middleware/validateAdmin");
const verifyAuthor = require("../middleware/verifyAuthor");
const softVerifyToken = require("../middleware/softVerifyToken");

const postRouter = Router();

postRouter.get("/api/posts", postController.getPost);

postRouter.get(
  "/api/posts/user/:username",
  verifyToken,
  postController.getUserPost,
);

postRouter.get(
  "/api/admin/posts",
  verifyToken,
  validateAdmin,
  postController.getAdmin,
);

postRouter.get("/api/posts/:id", softVerifyToken, postController.getUniquePost);

postRouter.post(
  "/api/posts",
  verifyToken,
  validate(postSchema),
  postController.postPost,
);
postRouter.put(
  "/api/posts/:postid/publish",
  verifyToken,
  verifyAuthor,
  postController.publishPost,
);
postRouter.put(
  "/api/posts/:postid/unpublish",
  verifyToken,
  verifyAuthor,
  postController.unpublishPost,
);

module.exports = postRouter;
