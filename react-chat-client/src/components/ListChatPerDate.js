import React from "react";
import ChatItem from "./ChatItem";
import "./ReactChat.css";

const colors = ["text-info", "text-danger", "text-primary", "text-warning"];

export default class ListChatPerDate extends React.Component {
  render() {
    let items = this.props.chats.map((chat, i) => (
      <ChatItem
        key={chat._id || chat.chatId}
        color={colors[i % 4]}
        chat={chat}
        remove={this.props.remove}
        resend={this.props.resend}
      />
    ));

    return (
      <div className="bg-transparent">
        <div className="hr-line-middle">
          <span>{this.props.date}</span>
        </div>
        <ul className="list-group bg-transparent">{items}</ul>
      </div>
    );
  }
}
