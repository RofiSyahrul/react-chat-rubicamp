import React from "react";
import ReactMarkdown from "react-markdown";
import "./ReactChat.css";

class ChatItem extends React.Component {
  render() {
    const removeChat = e => {
      e.preventDefault();
      const id = e.target.parentElement.getAttribute("id");
      this.props.remove(id.slice(6));
    };

    return (
      <li className="list-group-item borderless bg-transparent mx-n2 mx-sm-0">
        <div className="row justify-content-between align-items-center">
          <div className="col-1 mr-3 mr-sm-0">
            <button
              type="button"
              className={`${this.props.color} btn bg-transparent`}
              id={`delete${this.props.chat._id || this.props.chat.chatId}`}
              onClick={removeChat}
            >
              <i className="fa fa-minus-circle fa-3x"></i>
            </button>
          </div>
          <div className="col-9 col-sm-9 col-md-10 col-lg-11 ml-3 ml-sm-0 speech-bubble">
            <div className="row justify-content-between sender mt-2">
              <div className="col-auto">
                <ReactMarkdown source={this.props.chat.sender} className={this.props.color} />
              </div>
              <div className="col-auto text-secondary">
                {this.props.chat.time}
              </div>
            </div>
            <div className="row mb-1">
              <div className="col-12 chat-message">
                <ReactMarkdown source={this.props.chat.message} />
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default ChatItem;
