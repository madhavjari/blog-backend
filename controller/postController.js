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
  getPublishedPostByUser,
  deletePostById,
} = require("../db/queries");

async function getPost(req, res) {
  const posts = await getPublishedPost();
  if (!posts) return res.status(404).json({ message: "No posts" });
  res.json({
    title: "Madhav's Blog",
    posts,
  });
}

async function getUserPost(req, res) {
  try {
    const username = req.params.username;
    let user = req.user;
    const author = await findUserId(username);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    const authorId = parseInt(author.id);

    if (!user || username !== user.username) {
      const userPost = await getPublishedPostByUser(authorId);
      return res.status(200).json({ title: `${username}'s Blog`, userPost });
    }

    const userPost = await getPostByUser(authorId);
    return res.json({
      title: `${username}'s Blog`,
      userPost,
    });
  } catch {
    return res.status(403).json({
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
  try {
    const postId = parseInt(req.params.id);
    console.log(postId);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid Post ID format" });
    }
    const post = await getPostById(postId);
    console.log(post);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.published) {
      return res.status(200).json({
        post,
      });
    }
    if (req.user) {
      const user = req.user.username;
      const author = await findUserId(user);
      const authorId = parseInt(author.id);
      post["isDraft"] = true;
      if (authorId === post.userId) {
        return res.status(200).json({
          post,
        });
      }
    }
    return res
      .status(403)
      .json({ message: "You do not have permission to view this draft." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function postPost(req, res) {
  const { title, content } = req.body;
  const user = req.user.username;
  const author = await findUserId(user);
  if (!author) {
    return res
      .status(401)
      .json({ error: "User authentication failed. Missing user identifier." });
  }
  const authorId = parseInt(author.id);
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
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid post ID format" });
  }
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
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid post ID format" });
  }
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

async function deletePost(req, res) {
  try {
    const id = parseInt(req.params.id);
    await deletePostById(id);
    return res.status(200).json({
      message: "post deleted successfully",
    });
  } catch (error) {
    console.error("Error in deletePost controller:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the post",
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
  deletePost,
};
