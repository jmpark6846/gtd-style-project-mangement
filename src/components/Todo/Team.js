import React, { Component } from "react";
import List from "./List";
import { FiMoreHorizontal } from "react-icons/fi";
import { Button, Heading, IconButton, DetailHeadingPane, DetailDescriptionPane } from "../common";
import { db } from "../../db";
import { generateId, getSortedByOrderProp } from "../../utils";
import QuickAdd from "../QuickAdd/QuickAdd";
import ContentEditable from "react-contenteditable";


export default class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.teamId || "",
      name: "",
      description: "",
      lists: {},
      length: 0,
      isAddShown: false,
      isEditShown: false
    };
    this.teamRef = db.ref(`teams/${this.state.id}`);
    this.listRef = db.ref(`lists/${this.state.id}`);
  }

  componentDidMount() {
    this.teamRef.on("value", data => {
      const project = data.val() || {};
      this.setState(project);
    });
    this.listRef.on("value", data => {
      const lists = data.val() || {};
      this.setState({ lists, length: Object.keys(lists).length });
    });
  }

  componentWillUnmount() {
    this.teamRef.off("value")
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

  _handleUpdateTeam = async ({ text, notes }) => {
    try {
      await this.teamRef.update({
        name: text,
        description: notes
      });
    } catch (error) {
      console.log("error updating team: " + error);
    }
    this.setState({
      name: text,
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

  render() {
    return (
      <div>
        {this.state.isEditShown && (
          <QuickAdd
            textPlaceholder="프로젝트 이름"
            notesPlaceholder="설명(선택)"
            text={this.state.name}
            notes={this.state.description}
            onSubmit={this._handleUpdateTeam}
            onCancel={() => this._handleToggleQuickAdd("edit")}
          />
        )}
        {!this.state.isEditShown && (
          <React.Fragment>
            <DetailHeadingPane>
              <Heading>{this.state.name}</Heading>
              <IconButton onClick={() => this._handleToggleQuickAdd("edit")}>
                <FiMoreHorizontal />
              </IconButton>
            </DetailHeadingPane>
            <DetailDescriptionPane>
              <ContentEditable html={this.state.description} />
            </DetailDescriptionPane>
          </React.Fragment>
        )}

        {getSortedByOrderProp(this.state.lists).map(list => (
          <List
            key={list.id}
            projectId={this.state.id}
            listId={list.id}
            heading={list.heading}
            description={list.description}
          />
        ))}
        {this.state.isAddShown && (
          <QuickAdd
            textPlaceholder="새 리스트"
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
      </div>
    );
  }
}
