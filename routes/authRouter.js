const { Router } = require("express");

const authController = require("../controller/authController");
const { registerSchema } = require("../schema/authSchema");
const { validate } = require("../middleware/zodValidator");

const authRouter = Router();

authRouter.get("/api/auth/login", authController.getLogin);

authRouter.post("/api/auth/login", authController.postLogin);

authRouter.get("/api/auth/register", authController.getRegister);

authRouter.post(
  "/api/auth/register",
  validate(registerSchema),
  authController.postRegister,
);

module.exports = authRouter;
