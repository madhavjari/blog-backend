const {
  createPost,
  findUserId,
  findPost,
  changePublishToTrue,
  changePublishToFalse,
} = require("../db/queries");

async function getPost(req, res) {
  const post = req.body;

  res.json({
    title: "Madhav's Blog",
    post,
  });
}

async function postPost(req, res) {
  const { title, content } = req.body;
  const user = req.user.username;
  const authorId = await findUserId(user);
  if (!authorId) {
    return res
      .status(401)
      .json({ error: "User authentication failed. Missing user identifier." });
  }
  const post = await createPost({
    title,
    content,
    authorId,
  });
  res.status(200).json({
    post,
    message: "Post created",
  });
}

async function publishPost(req, res) {
  const id = parseInt(req.params.postid);
  const post = await findPost(id);
  if (post) {
    if (post.published === true)
      return res.status(400).json({ error: "Post is already published" });
    await changePublishToTrue(id);
    res.json({
      message: "Post Published",
    });
  } else {
    res.status(401).json({
      error: "post not found",
    });
  }
}

async function unpublishPost(req, res) {
  const id = parseInt(req.params.postid);
  if (await findPost(id)) {
    await changePublishToFalse(id);
    res.json({
      message: "Post unpublished",
    });
  } else {
    res.status(401).json({
      error: "post not found",
    });
  }
}

module.exports = { getPost, postPost, publishPost, unpublishPost };
