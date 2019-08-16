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
import ProjectContainer from "../../containers/ProjectContainer";

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
      length: 0
    };
    this.listRef = db.collection("lists").doc(props.listId);
    this.todosRef = db.collection("todos");
  }

  _handleCloseQuickAdd = () => {
    this.setState({ isAddShown: !this.state.isAddShown });
  };

  _handleAddTodo = async ({ text, notes, userId, addTodo }) => {
    const todoId = generateId();
    const newTodo = {
      id: todoId,
      text,
      notes,
      userId,
      listId: this.props.listId,
      done: false,
      order: this.state.length + 1
    };

    try {
      await this.todosRef.doc(todoId).set(newTodo);
    } catch (error) {
      console.error("error adding todo: " + error);
    }

    addTodo(this.props.listId, newTodo);
    this.setState({
      length: newTodo.order
    });
  };

  _handleChangeTodo = async ({ todoId, text, notes, updateTodo }) => {
    const { listId } = this.props;
    try {
      await this.todosRef.doc(todoId).update({ text, notes });
    } catch (error) {
      console.error("error change todo: " + error);
    }
    updateTodo(todoId, listId, { text, notes });
  };

  _handleCheckTodo = async ({ todo, todoId, updateTodo }) => {
    const { listId } = this.props;

    try {
      await this.todosRef.doc(todoId).update({ done: !todo.done });
    } catch (error) {
      console.error("error check todo: " + error);
    }
    updateTodo(todoId, listId, { done: !todo.done });
  };

  _handleDeleteTodo = async ({ todoId, deleteTodo }) => {
    const { listId } = this.props;
    try {
      await this.todosRef.doc(todoId).delete();
    } catch (error) {
      console.log("error delete todo: " + error);
    }
    deleteTodo(todoId, listId)
  };

  getOnlyNotDone = todos => {
    let todosShown = getSortedByOrderProp(todos || {});
    if (this.props.onlyNotDone) {
      todosShown = todosShown.filter(todo => !todo.done);
    }
    return todosShown;
  };

  render() {
    const { listId } = this.props;
    return (
      <Subscribe to={[AuthContainer, ProjectContainer]}>
        {(authCon, projectCon) => (
          <ListPane>
            {this.props.hideHeading && (
              <div>
                <Link to={`${this.props.match.url}/lists/${this.props.listId}`}>
                  <SubHeading>{this.props.heading}</SubHeading>
                </Link>
                <ContentEditable html={this.props.description} />
              </div>
            )}

            {this.getOnlyNotDone(projectCon.state.todos[listId]).map(todo => (
              <Todo
                key={todo.id}
                id={todo.id}
                user={todo.user}
                text={todo.text}
                done={todo.done}
                notes={todo.notes}
                order={todo.order}
                onCheck={() => {
                  this._handleCheckTodo({
                    todo: projectCon.state.todos[listId][todo.id],
                    todoId: todo.id,
                    updateTodo: projectCon.updateTodo
                  });
                }}
                onSubmit={data =>
                  this._handleChangeTodo({
                    ...data,
                    todoId: todo.id,
                    updateTodo: projectCon.updateTodo
                  })
                }
                onDelete={() => this._handleDeleteTodo({ todoId: todo.id, deleteTodo: projectCon.deleteTodo })}
              />
            ))}

            <div>
              {this.state.isAddShown && (
                <QuickAdd
                  textPlaceholder="할 일 제목"
                  notesPlaceholder="노트(선택)"
                  onSubmit={data =>
                    this._handleAddTodo({
                      ...data,
                      userId: authCon.state.id,
                      addTodo: projectCon.addTodo
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
