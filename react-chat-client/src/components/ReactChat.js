import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ListChat from "./ListChat";
import AddChat from "./AddChat";
import { formatTime, groupChats } from "../helpers";
import io from "socket.io-client";
const socket = io("http://localhost:3001");

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success ml-2",
    cancelButton: "btn btn-danger"
  },
  buttonsStyling: false
});

export default class ReactChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { chats: [], chatsPerDate: [], typerExist: false, typer: "" };
    this.endRef = null;
  }

  componentDidMount() {
    this.getChats();
    this.scrollToBottom();

    socket.on("delete chat", id => {
      this.delChatClient(id);
    });

    socket.on("new chat", data => {
      const { chatId, sender, message } = data;
      this.addChatClient(chatId, sender, message);
    });

    socket.on("key up", typer => {
      if (typeof typer === "string") {
        if (typer === "") typer = "Unknown";
        this.setState({ typerExist: true, typer });
      } else this.setState({ typerExist: false, typer: "" });
    });

    socket.on("new chat failed", id => {
      this.addChatFailedClient(id);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.chats.length < this.state.chats.length)
      this.scrollToBottom();
  }

  getChats = () => {
    axios
      .get("http://localhost:3001/api/chat")
      .then(res => {
        // copying strategy: https://stackoverflow.com/questions/47624142/right-way-to-clone-objects-arrays-during-setstate-in-react
        this.setState(() => {
          let chats = res.data.map(chat => {
            chat.sent = true;
            return chat;
          });
          let copiedChats = JSON.parse(JSON.stringify(chats));
          return { chats, chatsPerDate: groupChats(copiedChats) };
        });
      })
      .catch(err => console.error(err));
  };

  delChatClient = id => {
    this.setState(state => {
      let chats = state.chats.filter(
        chat => chat._id !== id && chat.chatId !== id
      );
      let copiedChats = JSON.parse(JSON.stringify(chats));
      return { chats, chatsPerDate: groupChats(copiedChats) };
    });
  };

  deleteChat = id => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure to delete this message?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          this.delChatClient(id);
          socket.emit("delete chat", id);
          axios
            .delete("http://localhost:3001/api/chat/" + id)
            .then(res => {
              swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: res.data.message,
                type: "success",
                timer: 1000
              });
            })
            .catch(err => console.error(err));
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your chat is safe :)",
            type: "error",
            timer: 2000
          });
        }
      });
  };

  addChatClient = (id = 0, sender = "", message = "", idDeleted) => {
    this.setState(state => {
      let chats = state.chats;
      if (idDeleted)
        chats = state.chats.filter(chat => chat.chatId !== idDeleted);
      let newChat = {
        chatId: id,
        sender,
        message,
        sent: true,
        time: new Date().toString()
      };
      chats = [...chats, formatTime(newChat)];
      let copiedChats = JSON.parse(JSON.stringify(chats));
      return { chats, chatsPerDate: groupChats(copiedChats) };
    });
  };

  addChatFailed = (id = 0) => {
    this.setState(state => {
      let chats = state.chats.map(chat => {
        if (chat.chatId === id) chat.sent = false;
        return chat;
      });
      let copiedChats = JSON.parse(JSON.stringify(chats));
      return { chats, chatsPerDate: groupChats(copiedChats) };
    });
  };

  addChatFailedClient = () => {
    this.setState(state => {
      let chats = state.chats;
      chats = chats.filter(chat => chat.sent);
      let copiedChats = JSON.parse(JSON.stringify(chats));
      return { chats, chatsPerDate: groupChats(copiedChats) };
    });
  };

  addChat = (sender = "", message = "", idDeleted) => {
    if (sender.length > 0 && message.length > 0) {
      let chatId = Date.now();
      this.addChatClient(chatId, sender, message, idDeleted);
      socket.emit("new chat", { chatId, sender, message });
      axios
        .post("http://localhost:3001/api/chat", { sender, message, chatId })
        .then(() => {})
        .catch(err => {
          this.addChatFailed(chatId);
          socket.emit("new chat failed", chatId);
        });
    } else {
      Swal.fire({
        title: "Message or sender cannot be empty",
        type: "error"
      });
    }
  };

  resendChat = (chat = {}) => {
    const { sender, message, chatId } = chat;
    this.addChat(sender, message, chatId);
  };

  setTyper = typer => {
    socket.emit("key up", typer);
  };

  setEndRef = element => {
    this.endRef = element;
  };

  scrollToBottom = () => {
    if (this.endRef) this.endRef.scrollIntoView({ behaviour: "smooth" });
  };

  render() {
    return (
      <div className="container">
        <div className="card body-dashboard">
          <div className="card-header bg-dark text-white">
            <div className="row justify-content-between align-items-center mx-1">
              <span className="h3">
                <i className="fa fa-comments-o fa-lg mx-2"></i>
                React Chat
              </span>
              <div className="col-auto float-right text-right">
                <p className="badge badge-light badge-pill align-items-end text-right">
                  {this.state.chats.length} messages
                </p>
                {this.state.typerExist ? <br /> : ""}
                {this.state.typerExist ? (
                  <p
                    className="align-items-end"
                    style={{
                      marginTop: "-0.9rem",
                      marginBottom: "-0.9rem"
                    }}
                  >
                    {this.state.typer} is typing...
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div
            className="card-body bg-transparent"
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            <ListChat
              chatsPerDate={this.state.chatsPerDate}
              endRef={this.setEndRef}
              remove={this.deleteChat}
              resend={this.resendChat}
            />
            <AddChat addChat={this.addChat} setTyper={this.setTyper} />
          </div>
        </div>
      </div>
    );
  }
}
