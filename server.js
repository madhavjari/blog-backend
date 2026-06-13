const express = require("express");
const postRouter = require("./routes/postRouter");
const authRouter = require("./routes/authRouter");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blog-frontend-ten-theta.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(postRouter);
app.use(authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Server running on port ${PORT}`);
});
