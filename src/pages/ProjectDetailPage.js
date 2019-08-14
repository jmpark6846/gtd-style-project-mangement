import React, { Component } from "react";
import ContentEditable from "react-contenteditable";
import { withRouter } from "react-router-dom";
import { db, firebaseAuth } from "../db";
import { generateId, getSortedByOrderProp } from "../utils";
import {
  Button,
  DetailDescriptionPane,
  DetailHeadingPane,
  Heading
} from "../components/common";
import Dropdown from "../components/Dropdown/Dropdown";
import QuickAdd from "../components/QuickAdd/QuickAdd";
import List from "../components/Todo/List";
import Dialog from "../components/Dialog/Dialog";

class ProjectDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.projectId || "",
      name: "",
      description: "",
      lists: {},
      length: 0,
      isAddShown: false,
      isEditShown: false,
      isAddTeammateOpen: false
    };
    this.projectRef = db.ref(`projects/${this.state.id}`);
    this.listRef = db.ref(`lists/${this.state.id}`);
  }

  componentDidMount() {
    firebaseAuth.onAuthStateChanged(googleAuth => {
      if (googleAuth !== null) {
        let user = null;
        db.ref("users")
          .child(googleAuth.uid)
          .on("value", data => {
            user = data.val();
            this.props.auth.setAuth(user);
          });
      }
    });

    this.projectRef.on("value", data => {
      this.setState(data.val() || {});
    });
    this.listRef.on("value", data => {
      const lists = data.val() || {};
      this.setState({ lists, length: Object.keys(lists).length });
    });
  }

  componentWillUnmount() {
    this.projectRef.off("value");
    this.listRef.off("value");
  }

  _handleAddList = async ({ text, notes }) => {
    const id = generateId();
    const { username, id: userId } = this.props.auth.state;
    const newList = {
      id,
      heading: text,
      user: { username, id: userId },
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
      await this.teamRef.update({
        name: text,
        description: notes
      });
    } catch (error) {
      console.log("error updating project: " + error);
    }
    this.setState({
      name: text,
      description: notes,
      isEditShown: false
    });
  };

  _handleDeleteProject = () => {
    this.projectRef.set(null).catch(error => console.error(error));
    this.listRef.set(null).catch(error => console.error(error));
    let projects = { ...this.props.auth.state.projects };
    delete projects[this.state.id];

    db.ref(`users/${this.props.auth.state.id}/projects`)
      .set(projects)
      .catch(error => console.error(error));

    this.props.auth.setAuth({ projects });
    this.props.history.push("/projects");
  };

  _handleToggleQuickAdd = type => {
    const newState =
      type === "add"
        ? { isAddShown: !this.state.isAddShown }
        : { isEditShown: !this.state.isEditShown };
    this.setState(newState);
  };
  _handleChangeTodo = ({ text, notes }) => {
    console.log(text, notes);
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
            onSubmit={this._handleUpdateProject}
            onCancel={() => this._handleToggleQuickAdd("edit")}
          />
        )}
        {!this.state.isEditShown && (
          <React.Fragment>
            <DetailHeadingPane>
              <Heading>{this.state.name}</Heading>
              <Dropdown>
                <Dropdown.Item
                  onClick={() => this._handleToggleQuickAdd("edit")}
                >
                  정보 수정
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => this.setState({ isAddTeammateOpen: true })}
                >
                  팀원 추가
                </Dropdown.Item>
                <Dropdown.Item onClick={this._handleDeleteProject}>
                  프로젝트 삭제
                </Dropdown.Item>
              </Dropdown>
            </DetailHeadingPane>
            <DetailDescriptionPane>
              <ContentEditable html={this.state.description} />
            </DetailDescriptionPane>
          </React.Fragment>
        )}

        {getSortedByOrderProp(this.state.lists).map(list => (
          <List
            hideHeading={true}
            onlyNotDone={true}
            key={list.id}
            projectId={this.state.id}
            listId={list.id}
            heading={list.heading}
            description={list.description}
            onSubmit={this._handleChangeTodo}
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
        {this.state.isAddTeammateOpen && (
          <Dialog onClose={() => this.setState({ isAddTeammateOpen: false })}>dsf</Dialog>
        )}
      </div>
    );
  }
}

export default withRouter(ProjectDetailPage);
