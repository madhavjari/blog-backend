const bcrypt = require("bcryptjs");
const crypto = require("node:crypto");
const {
  createUser,
  findUser,
  createRefreshToken,
  findRefreshToken,
  updateTokenRevoke,
  updateRevokedOnLogout,
  rotateRefreshToken,
} = require("../db/queries");
const {
  getAccessToken,
  generatedRefreshToken,
  refreshCookieOptions,
  hashToken,
  refreshExpiry,
} = require("../lib/token");
require("dotenv/config");

async function getRegister(req, res) {
  res.json({
    title: "Register to Madhav's Blog",
  });
}
async function getLogin(req, res) {
  res.json({
    title: "Welcome to Login Page",
  });
}

async function postRegister(req, res) {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { firstName, lastName, email, username, hashedPassword };
    await createUser(user);
    res.status(201).json({
      user,
      message: "Registered Successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function postLogin(req, res) {
  const { username, password } = req.body;
  try {
    const user = await findUser(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Invalid username or Password",
      });
    }
    const accessToken = getAccessToken(user.id);
    const { token: refreshToken, hash: refreshTokenHash } =
      generatedRefreshToken();
    await createRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: refreshExpiry(),
      family: crypto.randomUUID(),
    });
    res
      .cookie("refresh_token", refreshToken, refreshCookieOptions)
      .json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function postRefreshToken(req, res) {
  try {
    const presentedToken = req.cookies?.refresh_token;
    if (!presentedToken) {
      return res.status(401).json({ error: "Missing refresh token" });
    }
    const presentedHash = hashToken(presentedToken);
    const stored = await findRefreshToken({ tokenHash: presentedHash });
    if (!stored || stored.expiresAt < new Date() || stored.revoked) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
    if (stored.used) {
      await updateTokenRevoke({ family: stored.family }, { revoked: true });
      return res.status(401).json({ error: "Refresh token reuse detected" });
    }
    const { token: newRefreshToken, hash: newRefreshTokenHash } =
      generatedRefreshToken();

    await rotateRefreshToken({
      id: stored.id,
      userId: stored.userId,
      newHash: newRefreshTokenHash,
      family: stored.family,
      expiresAt: refreshExpiry(),
    });
    const newAccessToken = getAccessToken(stored.userId);
    res
      .cookie("refresh_token", newRefreshToken, refreshCookieOptions)
      .json({ accessToken: newAccessToken });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function postLogout(req, res) {
  try {
    const presentedToken = req.cookies?.refresh_token;

    if (presentedToken) {
      const hash = hashToken(presentedToken);
      await updateRevokedOnLogout({ tokenHash: hash }, { revoked: true });
    }
    res.clearCookie("refresh_token", refreshCookieOptions).status(204).end();
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  postLogout,
  postRefreshToken,
};
