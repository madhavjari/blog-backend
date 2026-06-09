const { z } = require("zod");

const { findUser, findEmail } = require("../db/queries");

const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(2, "First Name must be at least 2 characters")
      .max(30, "First Name must be less than 30 characters"),
    lastName: z
      .string()
      .min(2, "First Name must be at least 2 characters")
      .max(30, "First Name must be less than 30 characters"),
    email: z
      .email("Invalid Email Format")
      .trim()
      .toLowerCase()
      .max(30, "Email must be less than 30 characters")
      .refine(
        async (email) => {
          const user = await findEmail(email);
          return !user;
        },
        { message: "Email already taken" },
      ),
    username: z
      .string()
      .trim()
      .min(5, "Username must be at least 5 characters long")
      .max(30, "Username must have less than 30 characters")
      .refine(
        async (username) => {
          const user = await findUser(username);
          return !user;
        },
        { message: "username already taken" },
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password must have less than 30 characters"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, "Username is required").trim(),
    password: z.string().min(1, "Password is require"),
  }),
});

module.exports = { registerSchema, loginSchema };
