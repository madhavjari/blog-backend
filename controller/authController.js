const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUser } = require("../db/queries");
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
      return res.status(401).json({ message: "Invalid username" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }
    jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" },
      (err, token) => {
        res.status(200).json({
          message: "Login Successful",
          username,
          token,
        });
        if (err)
          return res.status(500).json({
            message: "Error generating auth token",
          });
      },
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function postLogout(req, res) {
  try {
    return res.status(200).json({
      message:
        "Logged out successfully. Please remove the token from client storage.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = { getLogin, getRegister, postRegister, postLogin, postLogout };
