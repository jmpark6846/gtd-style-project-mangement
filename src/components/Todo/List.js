import PropTypes from "prop-types";
import React, { Component } from "react";
import ContentEditable from "react-contenteditable";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import { Subscribe } from "unstated";
import AuthContainer from "../../containers/AuthContainer";
import { db } from "../../db";
import { generateId, getSortedByOrderProp } from "../../utils";
import { Button, SubHeading } from "../common";
import QuickAdd from "../QuickAdd/QuickAdd";
import Todo from "./Todo";


const ListPane = styled.div`
  margin-bottom: 20px;
`;

class List extends Component {
  
  static propTypes = {
    projectId: PropTypes.string,
    listId: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      isAddShown: false,
      length: 0,
      todos: {}
    };
    this.listRef = db.ref(`lists/${props.projectId}/${props.listId}`);
    this.todosRef = db.ref(`todos/${props.listId}`);
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

  _handleAddTodo = async ({ text, notes, username, userId }) => {
    const id = generateId();
    const newTodo = {
      id,
      text,
      notes,
      user: { username, id: userId },
      done: false,
      order: this.state.length + 1
    };

    try {
      await this.todosRef.child(id).set(newTodo);
    } catch (error) {
      console.error("error adding todo: " + error);
    }

    this.setState({
      todos: { ...this.state.todos, [id]: newTodo },
      length: newTodo.order
    });
  };

  _handleCheckTodo = async ({ id }) => {
    let selectedTodo = {
      ...this.state.todos[id],
      done: !this.state.todos[id].done
    };

    try {
      await this.todosRef.child(id).update({
        done: selectedTodo.done,
        checkedAt: selectedTodo.done ? Date.now() : null
      });
    } catch (error) {
      console.error("error check todo: " + error);
    }

    this.setState({ todos: { ...this.state.todos, [id]: selectedTodo } });
  };

  render() {
    const todosNotDone = getSortedByOrderProp(this.state.todos).filter(
      todo => !todo.done
    );

    return (
      <Subscribe to={[AuthContainer]}>
        {auth => (
          <ListPane>
            <div>
              <Link to={`${this.props.match.url}/lists/${this.props.listId}`}>
                <SubHeading>{this.props.heading}</SubHeading>
              </Link>
              <ContentEditable html={this.props.description} />
            </div>

            <div>
              {todosNotDone.map(todo => (
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
                  textPlaceholder="할 일 제목"
                  notesPlaceholder="노트(선택)"
                  onSubmit={({ text, notes }) =>
                    this._handleAddTodo({
                      text,
                      notes,
                      username: auth.state.username,
                      userId: auth.state.id
                    })
                  }
                  onCancel={this._handleCloseQuickAdd}
                />
              )}
              {!this.state.isAddShown && (
                <Button onClick={this._handleCloseQuickAdd} small>
                  추가하기
                </Button>
              )}
            </div>
          </ListPane>
        )}
      </Subscribe>
    );
  }
}
export default withRouter(List);
