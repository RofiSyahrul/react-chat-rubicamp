import React from "react";
import axios from "axios";
import moment from "moment";
import ListChatPerDate from "./ListChatPerDate";

function formatDateTerm(date) {
  const originFormat = "YYYY-MM-DD HH:mm:ss";
  const formatedDate = moment(date, originFormat).format("YYYY-MM-DD");
  const year = moment(date, originFormat).format("YYYY");
  const today = moment().format("YYYY-MM-DD");
  const yesterday = moment()
    .subtract(1, "d")
    .format("YYYY-MM-DD");
  const thisYear = moment().format("YYYY");
  if (year === thisYear) {
    switch (formatedDate) {
      case today:
        return "Today";
      case yesterday:
        return "Yesterday";
      default:
        return moment(date, originFormat).format("MMM Do");
    }
  }
  return moment(date, originFormat).format("MMM Do YYYY");
}

export default class ReactChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { chats: [] };
    this.endRef = null;
  }

  componentDidMount() {
    this.getData();
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  getData = () => {
    axios
      .get("http://localhost:3001/api/chat")
      .then(res => {
        this.setState({ chats: res.data });
      })
      .catch(err => console.log(err));
  };

  setEndRef = element => {
    this.endRef = element;
  };

  scrollToBottom = () => {
    if (this.endRef) this.endRef.scrollIntoView({behaviour: "smooth"});
  };

  render() {
    let chats = this.state.chats.map(chat => {
      chat.date = formatDateTerm(chat.time);
      chat.time = `${chat.date}, ${moment(
        chat.time,
        "YYYY-MM-DD HH:mm:ss"
      ).format("HH:mm:ss")}`;
      return chat;
    });
    let date = chats[0] ? chats[0].date : "No chats";

    return (
      <div className="container">
        <div className="card body-dashboard">
          <div className="card-header bg-primary text-white h3">React Chat</div>
          <div className="card-body bg-transparent" style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <ListChatPerDate date={date} chats={chats} endRef={this.setEndRef} />
          </div>
        </div>
      </div>
    );
  }
}
