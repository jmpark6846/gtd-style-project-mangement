import React, { Component } from "react";
import styled from "styled-components";
import Todo from "./Todo";
import { Button } from "../common";
import QuickAdd from "../QuickAdd/QuickAdd";
import uuid from "uuid/v4";
import { todosRef, db } from "../../db";

const ListPane = styled.div``;
// const ListHeader = styled.header``;

export default class List extends Component {
  state = {
    isAddShown: false,
    heading: "취업준비",
    todos: {}
  };

  componentDidMount() {
    todosRef.on('value', data => this.setState({ todos: data.val() }))
  }
  
  componentWillUnmount() {
    todosRef.off('value')
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
      author: "jmpark6846"
    };

    await db.ref('todos/' + id).set(newTodo)
    this.setState({ todos: { ...this.state.todos, [id]: newTodo } });
  };

  _handleCheckTodo = async ({ id }) => {
    let selectedTodo = { ...this.state.todos[id] };
    selectedTodo.done = !selectedTodo.done;

    await db.ref('todos/'+id).update({ done: selectedTodo.done })
    this.setState({ todos: { ...this.state.todos, [id]: selectedTodo } });
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
