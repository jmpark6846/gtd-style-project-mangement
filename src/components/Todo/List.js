import React, { Component } from "react";
import styled from "styled-components";
import Todo from "./Todo";
import { Button } from "../common";
import QuickAdd from "../QuickAdd/QuickAdd";
import uuid from "uuid/v4";
import { todosRef, db } from "../../db";

const ListPane = styled.div``;

export default class List extends Component {
  state = {
    isAddShown: false,
    heading: "취업준비",
    length: 0,
    todos: {}
  };

  componentDidMount() {
    todosRef.on("value", data => {
      const todos = data.val() || {};
      this.setState({ todos: todos, length: Object.keys(todos).length });
    });
  }

  componentWillUnmount() {
    todosRef.off("value");
  }

  _handleCloseQuickAdd = () => {
    this.setState({ isAddShown: !this.state.isAddShown });
  };

  _handleAddTodo = async ({ text, notes }) => {
    const id = uuid()
      .split("-")
      .join("");
    const newTodo = {
      id,
      text,
      notes,
      done: false,
      user: "jmpark6846",
      order: this.state.length + 1
    };

    await db.ref("todos/" + id).set(newTodo);
    this.setState({
      todos: { ...this.state.todos, [id]: newTodo },
      length: newTodo.order
    });
  };

  _handleCheckTodo = async ({ id }) => {
    let selectedTodo = { ...this.state.todos[id] };
    selectedTodo.done = !selectedTodo.done;

    await db.ref("todos/" + id).update({ done: selectedTodo.done });
    this.setState({ todos: { ...this.state.todos, [id]: selectedTodo } });
  };

  _getSortedByOrder = () => {
    return Object.values(this.state.todos).sort((a, b) => a.order - b.order);
  };

  render() {
    return (
      <ListPane>
        <div>{this.state.heading}</div>
        <div>
          {this._getSortedByOrder().map(todo => (
            <Todo
              key={todo.id}
              user={todo.user}
              text={todo.text}
              done={todo.done}
              order={todo.order}
              onCheck={() => this._handleCheckTodo({ id: todo.id })}
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
