import React from "react";
import "./ReactChat.css";

class ChatItem extends React.Component {
  render() {
    return (
      <li className="list-group-item borderless bg-transparent">
        <div className="row justify-content-between">
          <div
            className="col-1 text-center"
            style={{ verticalAlign: "middle" }}
          >
            <a
              className={this.props.color}
              id={`delete${this.props.chat._id}`}
              href="/"
            >
              <i className="fa fa-minus-circle fa-3x"></i>
            </a>
          </div>
          <div className="col-9 col-sm-11 border bg-white">
            <div className="row justify-content-between sender mt-2">
              <div className={`col-auto ${this.props.color}`}>
                {this.props.chat.sender}
              </div>
              <div className="col-auto text-secondary">
                {this.props.chat.time}
              </div>
            </div>
            <div className="row mb-1">
              <div className="col-12">{this.props.chat.message}</div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default ChatItem;
