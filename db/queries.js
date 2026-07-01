const { prisma } = require("../lib/prisma.js");

async function createUser(user) {
  await prisma.user.create({
    data: {
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      username: user.username,
      password: user.hashedPassword,
    },
  });
}

async function createRefreshToken({ userId, tokenHash, expiresAt, family }) {
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      family,
    },
  });
}

async function getPostByUser(userId) {
  const posts = await prisma.post.findMany({
    where: { userId: userId },
    include: {
      user: {
        select: { username: true },
      },
    },
  });
  return posts;
}

async function getPublishedPost() {
  return prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      timestamp: true,
      userId: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    where: { published: true },
  });
}

async function getPublishedPostByUser(userId) {
  return prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      timestamp: true,
      userId: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    where: { published: true, userId: userId },
  });
}

async function getPostById(id) {
  return await prisma.post.findUnique({
    where: { id: id },
    include: {
      user: {
        select: { username: true },
      },
    },
  });
}

async function checkPostStatus(id) {
  return prisma.post.findUnique({
    select: { id: true },
    where: { id: id, published: true },
  });
}

async function getAllPost() {
  return prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      timestamp: true,
      published: true,
    },
  });
}

async function createPost({ title, content, authorId }) {
  return await prisma.post.create({
    data: {
      title: title,
      content: content,
      userId: authorId,
    },
  });
}

async function createComment({ content, postId, authorId }) {
  return await prisma.comment.create({
    data: {
      content: content,
      postId: postId,
      userId: authorId,
    },
    include: {
      user: {
        select: { username: true },
      },
    },
  });
}

async function getUsernames() {
  const { usernames } = await prisma.user.findMany({
    select: { username: true },
  });
  return usernames;
}

async function getUsernameByID(id) {
  const user = await prisma.user.findFirst({
    select: { username: true },
    where: { id: id },
  });
  return user;
}

async function findUser(username) {
  const user = await prisma.user.findUnique({
    where: { username: username },
  });
  return user;
}

async function findEmail(email) {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user;
}

async function findUserId(username) {
  const user = await prisma.user.findFirst({
    select: { id: true },
    where: {
      username: username,
    },
  });
  return user;
}

async function checkStatus(username) {
  const user = await prisma.user.findUnique({
    select: { status: true },
    where: { username: username },
  });
  return user.status;
}

async function changePostStatus(id, status) {
  await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      published: status,
    },
  });
}

async function getUserByPostId(id) {
  const post = await prisma.post.findUnique({
    select: { userId: true },
    where: {
      id: id,
    },
  });
  return post;
}

async function deletePostById(id) {
  await prisma.post.delete({
    where: { id: id },
  });
}

async function getCommentById(id, postId) {
  return await prisma.comment.findUnique({
    select: {
      id: true,
      content: true,
      timestamp: true,
      postId: true,
      userId: true,
    },
    where: { id: id, postId: postId },
  });
}

async function findRefreshToken({ tokenHash }) {
  const token = await prisma.refreshToken.findFirst({
    select: {
      id: true,
      expiresAt: true,
      userId: true,
      tokenHash: true,
      family: true,
      used: true,
    },
    where: {
      tokenHash: tokenHash,
    },
  });
  return token;
}

async function updateTokenRevoke({ family, revoked }) {
  await prisma.refreshToken.updateMany({
    where: {
      family: family,
    },
    data: {
      revoked: revoked,
    },
  });
}

async function rotateRefreshToken({ id, userId, newHash, family, expiresAt }) {
  await prisma.$transaction(async (tx) => {
    await tx.refreshToken.update({
      where: {
        id: id,
      },
      data: {
        used: true,
      },
    });

    await tx.refreshToken.create({
      data: {
        userId: userId,
        tokenHash: newHash,
        family: family,
        expiresAt,
      },
    });
  });
}

async function updateRevokedOnLogout({ tokenHash, revoked }) {
  await prisma.refreshToken.update({
    where: {
      tokenHash,
    },
    data: {
      revoked,
    },
  });
}

async function getCommentsOfPost(postid) {
  const comments = prisma.comment.findMany({
    where: {
      postId: postid,
    },
    include: { user: { select: { username: true } } },
  });
  return comments;
}

async function deleteCommentById(id) {
  await prisma.comment.delete({
    where: {
      id: id,
    },
  });
}

module.exports = {
  getUsernames,
  createUser,
  findUser,
  findEmail,
  createPost,
  findUserId,
  getPostByUser,
  getPublishedPost,
  getAllPost,
  checkStatus,
  getPostById,
  getUserByPostId,
  checkPostStatus,
  getPublishedPostByUser,
  deletePostById,
  getUsernameByID,
  getCommentById,
  createComment,
  createRefreshToken,
  findRefreshToken,
  updateTokenRevoke,
  rotateRefreshToken,
  updateRevokedOnLogout,
  getCommentsOfPost,
  changePostStatus,
  deleteCommentById,
};
