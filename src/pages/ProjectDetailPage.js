import React, { Component } from "react";
import ContentEditable from "react-contenteditable";
import { debounce } from "lodash";
import { withRouter } from "react-router-dom";
import { db, firebaseAuth } from "../db";
import { generateId, getSortedByOrderProp } from "../utils";
import {
  Button,
  DetailDescriptionPane,
  DetailHeadingPane,
  Heading,
  Input
} from "../components/common";
import Dropdown from "../components/Dropdown/Dropdown";
import QuickAdd from "../components/QuickAdd/QuickAdd";
import List from "../components/Todo/List";
import Dialog from "../components/Dialog/Dialog";
import Breadcumb from "../components/Breadcumb/Breadcumb";

class ProjectDetailPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      length: 0,
      teammate: "",
      isAddShown: false,
      isEditShown: false,
      isAddTeammateOpen: false
    };

    const { projectId } = this.props.match.params;
    this.projectRef = db.collection("projects").doc(projectId);
    this.listsRef = db.collection("lists");
  }

  _handleUpdateProject = async ({ text, notes }) => {
    const { projectId } = this.props.match.params;
    this.setState({
      isEditShown: false
    });

    try {
      await this.projectRef.update({
        name: text,
        description: notes
      });
    } catch (error) {
      console.log("error updating project: " + error);
    }

    this.props.projectCon.update({
      projects: {
        ...this.props.projectCon.state.projects,
        [projectId]: {
          ...this.props.projectCon.state.projects[projectId],
          name: text,
          description: notes
        }
      }
    });
  };

  _handleDeleteProject = async () => {
    const { projectId } = this.props.match.params;
    try {
      let authProjects = { ...this.props.authCon.state.projects };
      delete authProjects[projectId];
      await db
        .collection("users")
        .doc(this.props.authCon.state.id)
        .update({ projects: authProjects });
      this.props.authCon.setAuth({ projects: authProjects });

      let projects = { ...this.props.projectCon.state.projects };
      delete projects[projectId];
      await db
        .collection("projects")
        .doc(projectId)
        .delete();
      this.props.projectCon.update({ projects });

      let lists = { ...this.props.projectCon.state.lists };
      let deletedLists = { ...lists[projectId] };
      let deletedlistIds = Object.keys(deletedLists);

      deletedlistIds.forEach(
        async listId =>
          await db
            .collection("lists")
            .doc(listId)
            .delete()
      );
      delete lists[projectId];
      this.props.projectCon.update({ lists });

      let todos = { ...this.props.projectCon.state.todos };

      deletedlistIds.forEach(listId => {
        let deletedTodos = { ...todos[listId] };
        Object.keys(deletedTodos).forEach(
          async todoId =>
            await db
              .collection("todo")
              .doc(todoId)
              .delete()
        );
        delete todos[listId];
      });
      this.props.projectCon.update({ todos });
    } catch (error) {
      console.error("error deleting board: " + error);
    }
    this.props.history.push("/projects");
  };

  _handleAddList = async ({ text, notes }) => {
    const { projectId } = this.props.match.params;
    const listId = generateId();
    const newList = {
      id: listId,
      userId: this.props.authCon.state.id,
      heading: text,
      description: notes,
      order: this.state.length + 1
    };

    try {
      await db
        .collection("lists")
        .doc(listId)
        .set({
          ...newList,
          projectId,
          createdAt: Date.now()
        });
    } catch (error) {
      console.error("error adding list: " + error);
    }

    this.props.projectCon.update({
      lists: {
        ...this.props.projectCon.state.lists,
        [projectId]: {
          ...this.props.projectCon.state.lists[projectId],
          [listId]: newList
        }
      }
    });

    this.setState({
      isAddShown: false
    });
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

  _handleTeammateNameChange = e => {
    this.setState({ teammate: e.target.value });
    this._lookupTeammateName(e.target.value);
  };

  _lookupTeammateName = debounce(name => {
    db.ref("users")
      .orderByChild("username")
      .equalTo(name)
      .once("value", data => console.log(data.exists()));
  }, 500);

  render() {
    const { projectId } = this.props.match.params;
    const project = this.props.projectCon.state.projects[projectId];
    const projectLists = this.props.projectCon.state.lists[projectId];
    return this.props.projectCon.state.isLoading ? (
      <div>loading</div>
    ) : (
      <div>
        {/* <Breadcumb /> */}
        {this.state.isEditShown && (
          <QuickAdd
            textPlaceholder="프로젝트 이름"
            notesPlaceholder="설명(선택)"
            text={project.name}
            notes={project.description}
            onSubmit={this._handleUpdateProject}
            onCancel={() => this._handleToggleQuickAdd("edit")}
          />
        )}
        {!this.state.isEditShown && (
          <React.Fragment>
            <DetailHeadingPane>
              <Heading>{project.name}</Heading>
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
              <ContentEditable html={project.description} disabled={true}/>
            </DetailDescriptionPane>
          </React.Fragment>
        )}
        {getSortedByOrderProp(projectLists || {}).map(list => (
          <List
            key={list.id}
            hideHeading={true}
            onlyNotDone={true}
            projectId={projectId}
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
          <Dialog onClose={() => this.setState({ isAddTeammateOpen: false })}>
            <div>
              <Heading>팀원 초대하기</Heading>
              <Input
                value={this.state.teammate}
                onChange={this._handleTeammateNameChange}
              />
            </div>
          </Dialog>
        )}
      </div>
    );
  }
}

export default withRouter(ProjectDetailPage);
