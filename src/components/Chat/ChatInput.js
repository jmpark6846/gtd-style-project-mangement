import React from "react";
import PropTypes from "prop-types";
import ContentEditable from "react-contenteditable";
import styled from "styled-components";

const ChatInputPane = styled.div`
  padding: 10px;
  background-color: white;
  border-top: 1px solid #f3f3f3;
`;

function ChatInput({value, ...rest}) {
  return (
    <ChatInputPane>
      <ContentEditable
        {...rest}
        contentEditable={true}
        html={value}
        placeholder="Message here"
      />
    </ChatInputPane>
  );
}

ChatInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func
};

export default ChatInput;
