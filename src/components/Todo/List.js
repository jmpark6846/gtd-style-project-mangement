import React, { Component } from "react";
import styled from "styled-components";
import Todo from "./Todo";
import { Button } from "../common";
import QuickAdd from "../QuickAdd/QuickAdd";
import uuid from "uuid/v4";

const ListPane = styled.div``;

export default class Board extends Component {
  state = {
    todos: {
      1: {
        id: 1,
        author: "jmpark6846",
        text: "complete design",
        done: false,
        createdAt: Date.now()
      },
      2: {
        id: 2,
        author: "jmpark6846",
        text: "stay on track",
        done: true,
        createdAt: Date.now()
      }
    },
    isAddShown: false
  };

  _handleChangeTodo = (evt, id) => {
    // const newEditing = { ...this.state.editing }
    // this.setState({ editing: { ...this.state.editing, [id]: evt.target.value } })
  };
  _handleCloseQuickAdd = () => {
    this.setState({ isAddShown: !this.state.isAddShown });
  };

  _handleAddTodo = ({ text }) => {
    const id = uuid()
      .split("-")
      .join("");
    const newTodo = {
      id,
      text,
      author: "jmpark6846"
    };
    this.setState({ todos: { ...this.state.todos, [id]: newTodo } });
  };
  render() {
    const { todos, newTodo } = this.state;
    return (
      <ListPane>
        {Object.keys(todos).map(id => (
          <Todo
            key={id}
            author={todos[id].author}
            text={todos[id].text}
            done={todos[id].done}
            onChange={evt => this._handleChangeTodo(evt, id)}
          />
        ))}
        {this.state.isAddShown && (
          <QuickAdd
            onSubmit={this._handleAddTodo}
            onCancel={this._handleCloseQuickAdd}
          />
        )}
        {!this.state.isAddShown && (
          <Button onClick={this._handleCloseQuickAdd}>추가하기</Button>
        )}
      </ListPane>
    );
  }
}
