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

function Todo({ author, done, text, onChange }) {
  return (
    <TodoPane>
      <Checkbox type="checkbox" />
      <TodoText>{text}</TodoText>
      <AuthorLabel>{author}</AuthorLabel>
    </TodoPane>
  );
}
Todo.propTypes = {};

export default Todo;
