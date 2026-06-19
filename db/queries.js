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

async function getPostByUser(userId) {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      timestamp: true,
      published: true,
    },
    where: { userId: userId },
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
    select: {
      id: true,
      title: true,
      content: true,
      timestamp: true,
      userId: true,
      published: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    where: { id: id },
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

async function createComment({ content }) {
  return await prisma.comment.create({
    data: {
      content: content,
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

async function findPost(id) {
  const isAvail = await prisma.post.findUnique({
    select: { id: true, published: true },
    where: { id: id },
  });
  return isAvail;
}

async function changePublishToTrue(id) {
  await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      published: true,
    },
  });
}

async function changePublishToFalse(id) {
  await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      published: false,
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

async function getComment(id, postId) {
  await prisma.comment.findUnique({
    select: {
      id: true,
      content: true,
      timestamp: true,
    },
    where: { id: id, postId: postId },
  });
}

module.exports = {
  getUsernames,
  createUser,
  findUser,
  findEmail,
  createPost,
  findUserId,
  findPost,
  changePublishToTrue,
  changePublishToFalse,
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
  getComment,
  createComment,
};
