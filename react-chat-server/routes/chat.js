const express = require("express");
const moment = require("moment");
const router = express.Router();
const Chat = require("../models/chat");

function formatTime(doc = {}) {
  doc.time = moment(doc.time.toString(), "ddd MMM DD YYYY, HH:mm:ss ZZ").format(
    "YYYY-MM-DD HH:mm:ss"
  );
  return doc;
}

/* GET chats */
router.get("/", (req, res) => {
  Chat.aggregate()
    .sort("time")
    .exec()
    .then(docs => {
      docs = docs.map(formatTime);
      res.json(docs);
    })
    .catch(err => console.error(err));
});

// add chat
router.post("/", (req, res) => {
  const { sender, message, chatId } = req.body;
  let chat = new Chat({ sender, message, chatId });
  chat.save(err => {
    if (err) console.error(err);
    else {
      res.json(formatTime(chat.toObject()));
    }
  });
});

// delete chat
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let response = { success: false, message: "" };
  Chat.findByIdAndDelete(id, (err, doc) => {
    if (err) res.json(response);
    else {
      response.success = true;
      let chat = formatTime(doc.toObject());
      let time = `at ${chat.time}`;
      response.message = `Message from ${chat.sender} ${time} has been deleted`;
      res.json(response);
    }
  });
});

module.exports = router;
