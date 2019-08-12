import React, { Component } from "react";
import PropTypes from "prop-types";
import QuickAdd from "../components/QuickAdd/QuickAdd";
import {
  DetailHeadingPane,
  Heading,
  DetailDescriptionPane,
  IconButton,
  Button
} from "../components/common";
import { FiMoreHorizontal } from "react-icons/fi";
import { getSortedByOrderProp, generateId } from "../utils";
import ContentEditable from "react-contenteditable";
import { db } from "../db";
import Todo from "../components/Todo/Todo";

export default class ListDetailPage extends Component {
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
      await db.ref(`todos/${this.props.match.params.listId}/${id}`).set(newTodo);
    } catch (error) {
      console.error("error adding todo: " + error);
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
      await db
        .ref(`todos/${this.props.match.params.listId}/${id}`)
        .update({ done: selectedTodo.done });
    } catch (error) {
      console.error("error check todo: " + error);
    }

    this.setState({ todos: { ...this.state.todos, [id]: selectedTodo } });
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
      heading: text,
      description: notes,
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
              <IconButton onClick={() => this._handleToggleQuickAdd("edit")}>
                <FiMoreHorizontal />
              </IconButton>
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
              user={todo.user}
              text={todo.text}
              done={todo.done}
              order={todo.order}
              onCheck={() => this._handleCheckTodo({ id: todo.id })}
            />
          ))}
        <div>
          {this.state.isAddShown && (
            <QuickAdd
              textPlaceholder="할 일 제목"
              notesPlaceholder="노트(선택)"
              onSubmit={this._handleAddTodo}
              onCancel={this._handleCloseQuickAdd}
            />
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
