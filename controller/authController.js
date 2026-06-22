const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
require("dotenv/config");

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_DAYS = 30;

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
    const accessToken = jwt.sign(
      {
        sub: user.id,
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
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await createRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(
        Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
      ),
      family: crypto.randomUUID(),
    });
    res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
      })
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
    const { refresh_token: presentedToken } = req.cookies;
    if (!presentedToken) {
      return res.status(401).json({ error: "Missing refresh token" });
    }
    const presentedHash = crypto
      .createHash("sha256")
      .update(presentedToken)
      .digest("hex");
    const stored = await findRefreshToken({ tokenHash: presentedHash });
    if (!stored || stored.expiresAt < new Date() || stored.revoked) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
    if (stored.used) {
      await updateTokenRevoke({ family: stored.family }, { revoked: true });
      return res.status(401).json({ error: "Refresh token reuse detected" });
    }
    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    await rotateRefreshToken({
      id: stored.id,
      userId: stored.userId,
      newHash: newRefreshTokenHash,
      family: stored.family,
      expiresAt: new Date(
        Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
      ),
    });
    const newAccessToken = jwt.sign(
      {
        sub: stored.userId,
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
    res
      .cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
      })
      .json({ accessToken: newAccessToken });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function postLogout(req, res) {
  const { refresh_token: presentedToken } = req.cookies;
  console.log(req.cookies);

  if (presentedToken) {
    const hash = crypto
      .createHash("sha256")
      .update(presentedToken)
      .digest("hex");
    await updateRevokedOnLogout({ tokenHash: hash }, { revoked: true });
  }
  res
    .clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
    })
    .status(204)
    .end();
}

module.exports = {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  postLogout,
  postRefreshToken,
};
