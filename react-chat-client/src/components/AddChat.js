import React from "react";
import "./ReactChat.css";

export default class AddChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sender: "", message: "" };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    let sender = this.state.sender.trim();
    let message = this.state.message.trim();
    this.props.addChat(sender, message);
    if (
      (sender.length > 0 && message.length > 0) ||
      (sender.length === 0 && message.length === 0)
    )
      this.setState({ sender: "", message: "" });
  }

  onEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey) {
      e.preventDefault();
      this.formRef.click();
    }
  };

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className="mt-3"
        style={{ marginLeft: "-2rem" }}
      >
        <div className="row justify-content-between align-items-center mx-1">
          <div className="col-1">
            <button
              type="submit"
              className="btn text-success bg-transparent"
              ref={el => (this.formRef = el)}
            >
              <i className="fa fa-plus-circle fa-3x"></i>
            </button>
          </div>
          <div className="col-9 col-sm-9 col-md-10 col-lg-11 speech-bubble">
            <div className="form-group my-2">
              <div className="input-group">
                <div className="input-group-prepend text-center">
                  <div className="input-group-text" style={{ width: "2.5rem" }}>
                    <i className="fa fa-user"></i>
                  </div>
                </div>
                <input
                  name="sender"
                  type="text"
                  className="form-control"
                  onChange={this.handleInputChange}
                  placeholder="Your name"
                  value={this.state.sender}
                  onKeyUp={this.onEnterPress}
                />
              </div>
            </div>
            <div className="form-group my-2">
              <div className="input-group">
                <div className="input-group-prepend text-center">
                  <div className="input-group-text" style={{ width: "2.5rem" }}>
                    <i className="fa fa-commenting"></i>
                  </div>
                </div>
                <textarea
                  name="message"
                  cols="auto"
                  rows="3"
                  className="form-control"
                  onChange={this.handleInputChange}
                  placeholder="Type your message here..."
                  value={this.state.message}
                  onKeyUp={this.onEnterPress}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
