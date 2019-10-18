import React from "react";
import moment from "moment";
import ListChatPerDate from "./ListChatPerDate";
import "./ReactChat.css";

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

export default class ListChat extends React.Component {
  render() {
    let chats = this.props.chats.map(chat => {
      chat.date = formatDateTerm(chat.time);
      chat.time = `${chat.date}, ${moment(
        chat.time,
        "YYYY-MM-DD HH:mm:ss"
      ).format("HH:mm:ss")}`;
      return chat;
    });

    let allDates = chats.map(chat => chat.date);
    let uniqueDates = allDates.filter(
      (date, index) => allDates.indexOf(date) === index
    );
    let chatsPerDate = uniqueDates.map(date => ({
      date,
      chats: chats.filter(chat => chat.date === date)
    }));

    let components = chatsPerDate.map(item => (
      <ListChatPerDate
        key={item.date}
        date={item.date}
        chats={item.chats}
        remove={this.props.remove}
      />
    ));
    if (components.length === 0)
      components = (
        <ListChatPerDate
          date="No chats"
          chats={[]}
          remove={this.props.remove}
        />
      );

    return (
      <div
        className="bg-transparent borderless"
        style={{ maxHeight: "50vh", overflowY: "auto", marginLeft: "-2rem" }}
      >
        {components}
        <div key="ref" ref={this.props.endRef} tabIndex="-1"></div>
      </div>
    );
  }
}
