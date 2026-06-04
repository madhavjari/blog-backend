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

async function getUsernames() {
  const { usernames } = await prisma.user.findMany({
    select: { username: true },
  });
  return usernames;
}

async function getHashedPassword(username) {
  const password = await prisma.user.findFirst({
    where: { username: username },
  });
  return password;
}

module.exports = { getUsernames, getHashedPassword, createUser };
