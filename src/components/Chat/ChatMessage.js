import React from "react";
import PropTypes from "prop-types";
import Markdown from "react-markdown";
import styled from 'styled-components'

const ChatMessagePane = styled.div`
  background-color: white;
  margin-top: ${props => props.consecutive ? '5px' : '15px'};
`

const SenderDiv = styled.div`
  font-weight:600;
  margin-bottom: 5px;
`

function ChatMessage({ value, sender, hideSender, ...rest }) {
  return (
    <ChatMessagePane consecutive={hideSender}>
      { hideSender || <SenderDiv>{sender}</SenderDiv> }
      <Markdown {...rest} source={value} />
    </ChatMessagePane>  
  );
}

ChatMessage.propTypes = {
  sender: PropTypes.string,
  value: PropTypes.string
};

export default ChatMessage;
