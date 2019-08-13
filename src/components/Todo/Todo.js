import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Checkbox } from "../common";

const TodoPane = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid white;
  border-radius: 5px;
  margin-bottom: 5px;
  :hover {
    color: #000;
  }
`;

const AuthorLabel = styled.label`
  margin-left: 5px;
  color: lightslategray;
`;

const TodoText = styled.div``;

function Todo({ user, done, text, onCheck }) {
  return (
    <TodoPane
      draggable={true}
      onDragStart={event => {
        event.dataTransfer.setData("text/plain", "dragg!");
        console.log(event.dataTransfer);
      }}
      
    >
      <Checkbox checked={done} onChange={onCheck} />
      <TodoText>{text}</TodoText>
      <AuthorLabel>{user.username}</AuthorLabel>
    </TodoPane>
  );
}

Todo.propTypes = {
  user: PropTypes.string,
  text: PropTypes.string,
  done: PropTypes.bool
};

export default Todo;
