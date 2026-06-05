const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUser } = require("../db/queries");
require("dotenv/config");

async function getLogin(req, res) {
  res.json({
    title: "Login to Madhav's Blog",
  });
}

async function getRegister(req, res) {
  res.json({
    title: "Register to Madhav's Blog",
  });
}

async function postRegister(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { firstName, lastName, email, username, hashedPassword };
  await createUser(user);
  res.json({
    user,
    message: "Registered Successfully",
  });
}

async function postLogin(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = await findUser(username);
    if (!user) {
      res.json({
        message: "Invalid username",
      });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.json({
          message: "Invalid Password",
        });
      } else {
        jwt.sign(username, process.env.JWT_SECRET_KEY, (err, token) => {
          res.json({
            username,
            token,
          });
          if (err)
            res.json({
              err,
            });
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({
      message: err,
    });
  }
}

module.exports = { getLogin, getRegister, postRegister, postLogin };
