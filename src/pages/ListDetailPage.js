import React, { Component } from "react";
import PropTypes from "prop-types";
import QuickAdd from "../components/QuickAdd/QuickAdd";
import {
  DetailHeadingPane,
  Heading,
  DetailDescriptionPane,
  IconButton
} from "../components/common";
import { FiMoreHorizontal } from "react-icons/fi";
import { getSortedByOrderProp } from "../utils";
import ContentEditable from "react-contenteditable";
import List from "../components/Todo/List";
import { db } from "../db";
import Todo from "../components/Todo/Todo";

export default class ListDetailPage extends Component {
  // static propTypes = {
  //   prop: PropTypes
  // }
  constructor(props) {
    super(props);
    const { teamId, listId } = this.props.match.params;

    this.state = {
      id: listId || "",
      heading: "",
      description: "",
      lists: {},
      length: 0,
      isAddShown: false,
      isEditShown: false
    };
    this.listRef = db.ref(`lists/${teamId}/${listId}`);
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

  render() {
    return (
      <div>
        {this.state.isEditShown && (
          <QuickAdd
            textPlaceholder="프로젝트 이름"
            notesPlaceholder="설명(선택)"
            text={this.state.heading}
            notes={this.state.description}
            onSubmit={this._handleUpdateProject}
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
      </div>
    );
  }
}
