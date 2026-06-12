const { Router } = require("express");

const authController = require("../controller/authController");
const { registerSchema, loginSchema } = require("../schema/validatorSchema");
const { validate } = require("../middleware/zodValidator");
const verifyLoggedIn = require("../middleware/verifyLoggedIn");

const authRouter = Router();

authRouter.get("/api/auth/login", verifyLoggedIn, authController.getLogin);

authRouter.post(
  "/api/auth/login",
  validate(loginSchema),
  authController.postLogin,
);

authRouter.get("/api/auth/register", authController.getRegister);

authRouter.post(
  "/api/auth/register",
  validate(registerSchema),
  authController.postRegister,
);

authRouter.post("/api/auth/logout", authController.postLogout);

module.exports = authRouter;
