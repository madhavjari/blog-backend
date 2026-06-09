const {
  createPost,
  findUserId,
  findPost,
  changePublishToTrue,
  changePublishToFalse,
  getPublishedPost,
  getPostByUser,
  getAllPost,
  getPostById,
} = require("../db/queries");

async function getPost(req, res) {
  const posts = await getPublishedPost();
  res.json({
    title: "Madhav's Blog",
    posts,
  });
}

async function getUserPost(req, res) {
  try {
    const username = req.params.username;
    const authorId = parseInt(await findUserId(username));
    const publishedPost = await getPublishedPost();
    const userPost = await getPostByUser(authorId);
    res.json({
      title: `${username}'s Blog`,
      publishedPost,
      userPost,
    });
  } catch {
    res.status(403).json({
      message: "Invalid authorization",
    });
  }
}

async function getAdmin(req, res) {
  const posts = await getAllPost();
  res.json({
    title: "Admin's Page",
    posts,
  });
}

async function getUniquePost(req, res) {
  const postId = parseInt(req.params.id);
  console.log(postId);
  const post = await getPostById(postId);
  if (!post) res.status(401).json({ message: "Cannot view the post" });
  res.status(200).json({
    title: post.title,
    content: post.content,
    timeStamp: post.timestamp,
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

module.exports = {
  getPost,
  postPost,
  publishPost,
  unpublishPost,
  getUserPost,
  getAdmin,
  getUniquePost,
};
