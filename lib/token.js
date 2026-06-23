const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
require("dotenv/config");

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_DAYS = 30;

function getAccessToken(id) {
  return jwt.sign(
    {
      sub: id,
      jti: crypto.randomUUID(),
    },
    process.env.JWT_SECRET_KEY,
    {
      algorithm: "HS256",
      expiresIn: ACCESS_TOKEN_TTL,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    },
  );
}

function generatedRefreshToken() {
  const token = crypto.randomBytes(64).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hash };
}

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/auth",
  maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
};

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function refreshExpiry() {
  return new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
}

module.exports = {
  getAccessToken,
  generatedRefreshToken,
  refreshCookieOptions,
  hashToken,
  refreshExpiry,
};
