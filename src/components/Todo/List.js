import React, { Component } from "react";
import styled from "styled-components";
import Todo from "./Todo";
import { Button } from "../common";
import QuickAdd from "../QuickAdd/QuickAdd";
import { todosRef, db } from "../../db";
import { generateId, getSortedByOrderProp } from "../../utils";

const ListPane = styled.div``;

export default class List extends Component {
  constructor(props){
    super(props)

    this.state = {
      isAddShown: false,
      length: 0,
      todos: {}
    };
    this.todosRef = db.ref('todos/' + this.props.id)
  }

  componentDidMount() {
    this.todosRef.on("value", data => {
      const todos = data.val() || {};
      this.setState({ todos: todos, length: Object.keys(todos).length });
    });
  }

  componentWillUnmount() {
    this.todosRef.off("value");
  }

  _handleCloseQuickAdd = () => {
    this.setState({ isAddShown: !this.state.isAddShown });
  };

  _handleAddTodo = async ({ text, notes }) => {
    const id = generateId();
    const newTodo = {
      id,
      text,
      notes,
      done: false,
      user: "jmpark6846",
      order: this.state.length + 1
    };

    try {
      await db.ref(`todos/${this.props.id}/${id}`).set(newTodo);
    } catch (error) {
      console.error("error _handleAddTodo: " + error);
    }

    this.setState({
      todos: { ...this.state.todos, [id]: newTodo },
      length: newTodo.order
    });
  };

  _handleCheckTodo = async ({ id }) => {
    let selectedTodo = { ...this.state.todos[id] };
    selectedTodo.done = !selectedTodo.done;

    try {
      await db.ref(`todos/${this.props.id}/${id}`).update({ done: selectedTodo.done });  
    } catch (error) {
      console.error("error check todo: "+ error)
    }
    
    this.setState({ todos: { ...this.state.todos, [id]: selectedTodo } });
  };

  render() {
    return (
      <ListPane>
        <div>{this.props.heading}</div>
        <div>
          {getSortedByOrderProp(this.state.todos).map(todo => (
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
