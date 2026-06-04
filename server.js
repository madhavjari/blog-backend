const express = require("express");
const postRouter = require("./routes/postRouter");
const authRouter = require("./routes/authRouter");

const app = express();

const PORT = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(postRouter);
app.use(authRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port ${PORT}!`);
});
