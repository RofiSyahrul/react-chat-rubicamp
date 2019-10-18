const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose
  .connect("mongodb://localhost:27017/chat-db", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to chat-db");
  })
  .catch(err => {
    console.error(err);
  });

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const chatRouter = require("./routes/chat");
app.use("/api/chat", chatRouter);

io.on("connection", socket => {
  socket.on("new chat", msg => {
    io.emit("new chat", msg);
  });
  socket.on("key up", sender => {
    console.log(sender, "time:", Date.now());
    
    io.emit("key up", sender);
  });
});
server.listen(8000);

module.exports = app;
