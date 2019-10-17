import React from "react";
import ChatItem from "./ChatItem";
import "./ReactChat.css";

const colors = ["text-danger", "text-primary", "text-warning", "text-info"];

export default class ListChatPerDate extends React.Component {
  render() {
    let items = this.props.chats.map((chat, i) => (
      <ChatItem key={chat._id} color={colors[i % 4]} chat={chat} />
    ));

    return (
      <div className="bg-transparent">
        <div className="hr-line-middle">
          <span>{this.props.date}</span>
        </div>
        <ul className="list-group bg-transparent">
          {items}
          <div key="ref" ref={this.props.endRef} tabIndex="-1"></div>
        </ul>
      </div>
    );
  }
}
