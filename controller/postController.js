async function getPost(req, res) {
  const post = req.body;

  res.json({
    title: "Madhav's Blog",
    post,
  });
}

async function postPost(req, res) {
  const postTitle = req.body.title;
  const postContent = req.body.content;
  const timeStamp = Date.now();
  const published = req.body.published;
  let comment;
  if (published === "true") {
    comment = req.body.comment;
  }

  res.json({
    message: "Post created",
    posts: { postTitle, postContent, timeStamp, published, comment },
  });
}

module.exports = { getPost, postPost };
