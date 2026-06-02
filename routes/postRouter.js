const { Router } = require("express");
const postController = require("../controller/postController");

const postRouter = Router();

postRouter.get("/api/posts", postController.getPost);
postRouter.post("/api/posts", postController.postPost);

module.exports = postRouter;
