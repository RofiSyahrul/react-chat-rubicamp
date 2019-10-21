import io from "socket.io-client";
const socket = io("http://localhost:8000");

export const configureSocket = () => {
  socket.on("connect", () => console.log("Connected in client"))
  socket.on("new chat", (...argsServer) => {
    console.log(...argsServer);
    
    cb(...argsServer);
  });
  socket.emit(message, ...args);
}
