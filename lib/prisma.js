require("dotenv/config");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../generated/prisma/client.js");

const isProduction = process.env.NODE_ENV === "production";

const connectionString = isProduction
  ? process.env.DB_URL
  : process.env.DB_URL_LOCAL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };
