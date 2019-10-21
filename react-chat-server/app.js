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
let server = require("http").Server(app);
server = server.listen(8000);
const io = require("socket.io")(server);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("etag", false);
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});
app.use(cors());

const chatRouter = require("./routes/chat");
app.use("/api/chat", chatRouter);

io.on("connection", socket => {
  socket.on("new chat", (chatId, sender, message) => {
    io.emit("new chat", chatId, sender, message);
  });

  socket.on("delete chat", id => {
    io.emit("delete chat", id);
  });

  socket.on("key up", typer => {
    socket.broadcast.emit("key up", typer);
  });
});

module.exports = app;
