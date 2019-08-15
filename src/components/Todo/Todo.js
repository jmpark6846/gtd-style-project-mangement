import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { Checkbox } from "../common";
import QuickAdd from "../QuickAdd/QuickAdd";

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

class Todo extends React.Component {
  state = {
    editing: false
  };

  _handleEditChange = ({ target, value }) => {
    this.setState({ [target]: value });
  };

  _handleSubmit = ({ text, notes }) => {
    this.props.onSubmit({ text, notes });
    this.setState({ editing: false });
  };

  _handleDelete = () => {
    this.props.onDelete();
    this.setState({ editing: false });
  };

  render() {
    const { userId, done, text, notes, onCheck } = this.props;
    return this.state.editing ? (
      <QuickAdd
        text={text}
        notes={notes}
        textPlaceholder="할 일"
        notesPlaceholder="노트(선택)"
        onSubmit={this._handleSubmit}
        onDelete={this._handleDelete}
        onCancel={() =>
          this.setState({
            editing: false
          })
        }
      />
    ) : (
      <TodoPane
        draggable={true}
        onDragStart={event => {
          event.dataTransfer.setData("text/plain", "dragg!");
          console.log(event.dataTransfer);
        }}
        onClick={e => {
          this.setState({ editing: true });
        }}
      >
        <Checkbox
          checked={done}
          onClick={e => e.stopPropagation()}
          onChange={onCheck}
        />
        <TodoText>{text}</TodoText>
        <AuthorLabel>{userId}</AuthorLabel>
      </TodoPane>
    );
  }
}

Todo.propTypes = {
  user: PropTypes.object,
  text: PropTypes.string,
  done: PropTypes.bool
};

export default Todo;
