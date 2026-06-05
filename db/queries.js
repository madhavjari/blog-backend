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

async function createPost({ title, content, authorId }) {
  return await prisma.post.create({
    data: {
      title: title,
      content: content,
      userId: authorId,
    },
  });
}

async function getUsernames() {
  const { usernames } = await prisma.user.findMany({
    select: { username: true },
  });
  return usernames;
}

async function findUser(username) {
  const user = await prisma.user.findUnique({
    where: { username: username },
  });
  return user;
}

async function findUserId(username) {
  const id = await prisma.user.findUnique({
    select: { id: true },
    where: {
      username: username,
    },
  });
  return id.id;
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

module.exports = {
  getUsernames,
  createUser,
  findUser,
  createPost,
  findUserId,
  findPost,
  changePublishToTrue,
  changePublishToFalse,
};
