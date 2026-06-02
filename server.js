const express = require("express");
const indexRouter = require("./routes/postRouter");

const app = express();

const PORT = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(indexRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port ${PORT}!`);
});
