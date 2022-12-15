const express = require("express");
const app = express();
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

// 미들웨어
app.use(bodyParser.json());
// Import 라우터
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");

app.use("/posts", postRoute);
app.use("/comments", commentRoute);
// 라우터

app.get("/", (req, res) => {
  res.send("I'm inside the home");
});

mongoose.connect("mongodb://localhost:27017/SOLO", () => {
  console.log("connected");
});

app.listen(3000);
