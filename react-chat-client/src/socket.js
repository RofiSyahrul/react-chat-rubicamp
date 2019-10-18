import io from "socket.io-client";
const socket = io("http://localhost:8000");

export function subscribeChatHistory(cb1) {
  socket.on("new chat", str => {
    cb1();
  });
  socket.emit("new chat", "NEW");
}