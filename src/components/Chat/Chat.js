import React from "react";
import styled from "styled-components";
import uuid from "uuid/v4";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import "./Chat.css";

const ChatPane = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 100%;

  /* background-color: #fbfbfb; */
`;

const ChatDisplayPane = styled.div`
  padding: 10px;
  overflow: auto;
  flex: 1;
`;

const messages = {
  1: {
    sender: "jmpark6846",
    message: "Messages are **separate** from data",
    timestamp: Date.now()
  },
  2: {
    sender: "moss123",
    message: "we may want to *iterate* quickly",
    timestamp: Date.now()
  },
  3: {
    sender: "jmpark6846",
    message: "but still easily paginated and queried,",
    timestamp: Date.now()
  }
};

class Chat extends React.Component {
  state = {
    messages,
    value: "",
    prevKey: ""
  };

  _handleKeyDown = evt => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      
      if (this.state.value !== "") {
        const newMessage = {
          sender: "jmpark6846",
          message: this.state.value,
          timestamp: Date.now()
        };
        const id = uuid();
        this.setState({
          messages: { ...this.state.messages, [id]: newMessage },
          value: ""
        });
      }
    }
  };

  render() {
    const { messages, value } = this.state;
    let latestSender = "", hideSender = false;
    console.log(value)
    return (
      <ChatPane>
        <ChatDisplayPane>
          {Object.keys(messages).map(index => {
            if (latestSender === messages[index].sender) {
              hideSender = true;
            } else {
              hideSender = false;
              latestSender = messages[index].sender;
            }

            return (
              <ChatMessage
                hideSender={hideSender}
                sender={messages[index].sender}
                value={messages[index].message}
                key={index}
              />
            );
          })}
        </ChatDisplayPane>
        <ChatInput
          onChange={evt => { console.log(evt); this.setState({ value: evt.target.value }) }}
          // onKeyDown={this._handleKeyDown}
          placeholder="Message here"
          value={value}
        />
      </ChatPane>
    );
  }
}

export default Chat;
