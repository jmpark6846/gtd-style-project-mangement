import React, { Component } from "react";
import List from "./List";
import { Button } from "../common";
import { db } from "../../db";
import { generateId, getSortedByOrderProp } from "../../utils";
import QuickAdd from "../QuickAdd/QuickAdd";

let teamId = "random-team-id";
export default class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "4a7be928b0bd42ac99829fd46d7e018a",
      heading: "",
      description: "",
      lists: {},
      length: 0,
      isAddShown: false,
      isEditShown: false
    };
    this.projectRef = db.ref(`projects/${teamId}/${this.state.id}`);
    this.listRef = db.ref(`lists/${this.state.id}`);
  }

  componentDidMount() {
    this.projectRef.on('value', data => {
      const project = data.val() || {};
      this.setState(project)
    })
    this.listRef.on("value", data => {
      const lists = data.val() || {};
      this.setState({ lists, length: Object.keys(lists).length });
    });
  }

  componentWillUnmount() {
    this.listRef.off("value");
  }

  _handleAddList = async ({ text, notes }) => {
    const id = generateId();
    const newList = {
      id,
      heading: text,
      user: "jmpark6846",
      description: notes,
      order: this.state.length + 1
    };
    try {
      await db.ref(`lists/${this.state.id}/${id}`).set({
        ...newList,
        projects: this.state.id,
        createdAt: Date.now()
      });
    } catch (error) {
      console.error("error _handleAddList: " + error);
    }

    this.setState({
      lists: {
        ...this.state.lists,
        [id]: newList
      },
      length: newList.order,
      isAddShown: false
    });
  };

  _handleUpdateProject = async ({ text, notes }) => {
    try {
      await this.projectRef.update({
        heading: text,
        description: notes
      });
    } catch (error) {
      console.log("error updating project: " + error);
    }
    this.setState({
      heading: text,
      description: notes,
      isEditShown: false,
    });
  };

  _handleToggleQuickAdd = (type) => {
    const newState =
      type === "add"
        ? { isAddShown: !this.state.isAddShown }
        : { isEditShown: !this.state.isEditShown };
    this.setState(newState);
  };

  render() {
    console.log(this.state.lists);
    return (
      <div>
        <div>
          {this.state.isAddShown && (
            <QuickAdd
              textPlaceholder="새 프로젝트"
              notesPlaceholder="설명(선택)"
              onSubmit={this._handleAddList}
              onCancel={() => this._handleToggleQuickAdd("add")}
            />
          )}
          {!this.state.isAddShown && (
            <Button onClick={() => this._handleToggleQuickAdd("add")}>
              새 리스트 추가
            </Button>
          )}
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
            <div>
              <div>{this.state.heading}</div>
              <Button onClick={() => this._handleToggleQuickAdd("edit")}>
                프로젝트명 수정
              </Button>
            </div>
          )}
        </div>
        {getSortedByOrderProp(this.state.lists).map(list => (
          <List
            key={list.id}
            projectId={this.state.id}
            listId={list.id}
            heading={list.heading}
            description={list.description}
          />
        ))}
      </div>
    );
  }
}
