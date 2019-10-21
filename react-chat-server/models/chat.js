const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  sender: String,
  message: String,
  time: { type: Date, default: Date.now },
  chatId: Number
});

module.exports = mongoose.model("Chat", chatSchema);
