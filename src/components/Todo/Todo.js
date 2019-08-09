import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const TodoPane = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid white;
  border-radius: 5px;

  :hover {
    color: #000;
  }
`;

const AuthorLabel = styled.label`
  margin-left: 5px;
  color: lightslategray;
`;

const TodoText = styled.div``;

const Checkbox = styled.input`
  margin-right: 5px;
`;

function Todo({ user, done, text, onCheck, order }) {
  return (
    <TodoPane>
      <Checkbox type="checkbox" checked={done} onChange={onCheck} />
      <TodoText>{text}</TodoText>
      <AuthorLabel>{user}</AuthorLabel>
      <span>{order}</span>
    </TodoPane>
  );
}
Todo.propTypes = {
  user: PropTypes.string,
  text: PropTypes.string,
  done: PropTypes.bool,
};

export default Todo;
