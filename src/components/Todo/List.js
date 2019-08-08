import React, { Component } from "react";
import styled from "styled-components";
import Todo from "./Todo";
import { Button } from "../common";
import QuickAdd from "../QuickAdd/QuickAdd";
import uuid from "uuid/v4";

const ListPane = styled.div``;
// const ListHeader = styled.header``;

export default class List extends Component {
  state = {
    isAddShown: false,
    heading: "취업준비",
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
    }
  };

  _handleCloseQuickAdd = () => {
    this.setState({ isAddShown: !this.state.isAddShown });
  };

  _handleAddTodo = ({ text, notes }) => {
    const id = uuid()
      .split("-")
      .join("");
    const newTodo = {
      id,
      text,
      notes,
      author: "jmpark6846",
    };
    this.setState({ todos: { ...this.state.todos, [id]: newTodo } });
  };

  _handleCheckTodo = ({ id }) => {
    let selectedTodo = { ...this.state.todos[id] }
    selectedTodo.done = !selectedTodo.done
    this.setState({ todos: { ...this.state.todos, [id]: selectedTodo} });
  };
  
  render() {
    const { todos } = this.state;
    return (
      <ListPane>
        <div>{this.state.heading}</div>
        <div>
          {Object.keys(todos).map(id => (
            <Todo
              key={id}
              author={todos[id].author}
              text={todos[id].text}
              done={todos[id].done}
              onCheck={() => this._handleCheckTodo({ id })}
            />
          ))}
        </div>

        <div>
          {this.state.isAddShown && (
            <QuickAdd
              onSubmit={this._handleAddTodo}
              onCancel={this._handleCloseQuickAdd}
            />
          )}
          {!this.state.isAddShown && (
            <Button onClick={this._handleCloseQuickAdd}>추가하기</Button>
          )}
        </div>
      </ListPane>
    );
  }
}
