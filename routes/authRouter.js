const { Router } = require("express");

const authController = require("../controller/authController");

const authRouter = Router();

authRouter.get("/api/auth/login", authController.getLogin);

authRouter.post("/api/auth/login", authController.postLogin);

authRouter.get("/api/auth/register", authController.getRegister);

authRouter.post("/api/auth/register", authController.postRegister);

module.exports = authRouter;
