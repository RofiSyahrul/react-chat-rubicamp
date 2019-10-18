import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ListChat from "./ListChat";
import AddChat from "./AddChat";

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
    this.state = { chats: [] };
    this.endRef = null;
  }

  componentDidMount() {
    this.getChats();
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  getChats = () => {
    axios
      .get("http://localhost:3001/api/chat")
      .then(res => {
        this.setState({ chats: res.data });
      })
      .catch(err => console.error(err));
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
          axios
            .delete("http://localhost:3001/api/chat/" + id)
            .then(res => {
              swalWithBootstrapButtons.fire(
                "Deleted!",
                res.data.message,
                "success"
              );
              this.getChats();
            })
            .catch(err => console.error(err));
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your chat is safe :)",
            "error"
          );
        }
      });
  };

  addChat = (sender = "", message = "") => {
    if (sender.length > 0 && message.length > 0) {
      axios
        .post("http://localhost:3001/api/chat", { sender, message })
        .then(() => this.getChats())
        .catch(err => console.error(err));
    } else {
      Swal.fire({
        title: "Message or sender cannot be empty",
        type: "error"
      });
    }
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
              <p className="badge badge-light badge-pill">
                {this.state.chats.length} messages
              </p>
            </div>
          </div>
          <div
            className="card-body bg-transparent"
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            <ListChat
              chats={this.state.chats}
              endRef={this.setEndRef}
              remove={this.deleteChat}
            />
            <AddChat addChat={this.addChat} />
          </div>
        </div>
      </div>
    );
  }
}
