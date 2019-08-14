import React, { Component } from "react";
import ContentEditable from "react-contenteditable";
import { withRouter } from "react-router-dom";
import {
  Button,
  DetailDescriptionPane,
  DetailHeadingPane,
  Heading
} from "../components/common";
import Dropdown from "../components/Dropdown/Dropdown";
import QuickAdd from "../components/QuickAdd/QuickAdd";
import Todo from "../components/Todo/Todo";
import { db } from "../db";
import { generateId, getSortedByOrderProp } from "../utils";
import { Subscribe } from "unstated";
import AuthContainer from "../containers/AuthContainer";

class ListDetailPage extends Component {
  // static propTypes = {
  //   prop: PropTypes
  // }
  constructor(props) {
    super(props);
    const { projectId, listId } = this.props.match.params;

    this.state = {
      id: listId || "",
      heading: "",
      description: "",
      lists: {},
      todos: {},
      length: 0,
      isAddShown: false,
      isEditShown: false
    };
    this.listRef = db.ref(`lists/${projectId}/${listId}`);
    this.todosRef = db.ref(`todos/${listId}`);
  }

  componentDidMount() {
    this.listRef.on("value", data => {
      this.setState(data.val() || {});
    });

    this.todosRef.on("value", data => {
      const todos = data.val() || {};
      this.setState({ todos: todos, length: Object.keys(todos).length });
    });
  }

  componentWillUnmount() {
    this.listRef.off("value");
    this.todosRef.off("value");
  }
  _handleAddTodo = async ({ text, notes, user }) => {
    const id = generateId();
    const newTodo = {
      id,
      text,
      notes,
      done: false,
      user,
      order: this.state.length + 1
    };

    try {
      await this.todosRef.child(id).set(newTodo);
    } catch (error) {
      console.error("error adding todo: " + error);
    }

    this.setState({
      length: newTodo.order
    });
  };

  _handleUpdateList = async ({ text, notes }) => {
    try {
      await this.listRef.update({
        heading: text,
        description: notes
      });
    } catch (error) {
      console.log("error updating list: " + error);
    }
    this.setState({
      isEditShown: false
    });
  };

  _handleToggleQuickAdd = type => {
    const newState =
      type === "add"
        ? { isAddShown: !this.state.isAddShown }
        : { isEditShown: !this.state.isEditShown };
    this.setState(newState);
  };

  _handleCloseQuickAdd = () => {
    this.setState({ isAddShown: !this.state.isAddShown });
  };

  _handleDeleteList = () => {
    this.listRef.set(null).catch(error => console.error(error));
    this.props.history.push(`/projects/${this.props.match.params.projectId}`);
  };

  _handleChangeTodo = async ({ todoId, text, notes }) => {
    try {
      await this.todosRef.child(todoId).update({ text, notes });
    } catch (error) {
      console.error("error change todo: " + error);
    }
  };

  _handleCheckTodo = async ({ todoId }) => {
    let selectedTodo = { ...this.state.todos[todoId] };
    selectedTodo.done = !selectedTodo.done;

    try {
      await this.todosRef.child(todoId).update({ done: selectedTodo.done });
    } catch (error) {
      console.error("error check todo: " + error);
    }
  };

  _handleDeleteTodo = async ({ todoId }) => {
    try {
      await this.todosRef.child(todoId).set(null);
    } catch (error) {
      console.log("error delete todo: " + error);
    }
  };
  render() {
    return (
      <div>
        {this.state.isEditShown && (
          <QuickAdd
            textPlaceholder="프로젝트 이름"
            notesPlaceholder="설명(선택)"
            text={this.state.heading}
            notes={this.state.description}
            onSubmit={this._handleUpdateList}
            onCancel={() => this._handleToggleQuickAdd("edit")}
          />
        )}
        {!this.state.isEditShown && (
          <React.Fragment>
            <DetailHeadingPane>
              <Heading>{this.state.heading}</Heading>
              <Dropdown>
                <Dropdown.Item
                  onClick={() => this._handleToggleQuickAdd("edit")}
                >
                  정보 수정
                </Dropdown.Item>
                <Dropdown.Item onClick={this._handleDeleteList}>
                  리스트 삭제
                </Dropdown.Item>
              </Dropdown>
            </DetailHeadingPane>
            <DetailDescriptionPane>
              <ContentEditable html={this.state.description} />
            </DetailDescriptionPane>
          </React.Fragment>
        )}

        {this.state.todos &&
          getSortedByOrderProp(this.state.todos).map(todo => (
            <Todo
              key={todo.id}
              id={todo.id}
              user={todo.user}
              text={todo.text}
              done={todo.done}
              notes={todo.notes}
              order={todo.order}
              onCheck={() => {
                this._handleCheckTodo({ todoId: todo.id });
              }}
              onSubmit={data =>
                this._handleChangeTodo({ ...data, todoId: todo.id })
              }
              onDelete={() => this._handleDeleteTodo({ todoId: todo.id })}
            />
          ))}
        <div>
          {this.state.isAddShown && (
            <Subscribe to={[AuthContainer]}>
              {auth => (
                <QuickAdd
                  textPlaceholder="할 일 제목"
                  notesPlaceholder="노트(선택)"
                  onSubmit={data =>
                    this._handleAddTodo({
                      ...data,
                      user: { id: auth.state.id, username: auth.state.username }
                    })
                  }
                  onCancel={this._handleCloseQuickAdd}
                />
              )}
            </Subscribe>
          )}
          {!this.state.isAddShown && (
            <Button onClick={this._handleCloseQuickAdd} small>
              추가하기
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(ListDetailPage);
