import React from "react";
import ListChatPerDate from "./ListChatPerDate";
import "./ReactChat.css";

export default class ListChat extends React.Component {
  render() {
    let components = this.props.chatsPerDate.map(item => (
      <ListChatPerDate
        key={item.date}
        date={item.date}
        chats={item.chats}
        remove={this.props.remove}
        resend={this.props.resend}
      />
    ));
    if (components.length === 0)
      components = (
        <ListChatPerDate
          date="No chats"
          chats={[]}
          remove={this.props.remove}
          resend={this.props.resend}
        />
      );

    return (
      <div
        className="bg-transparent borderless"
        style={{ maxHeight: "50vh", overflowY: "auto", marginLeft: "-2rem" }}
      >
        {components}
        <div key="ref" ref={this.props.endRef}></div>
      </div>
    );
  }
}
