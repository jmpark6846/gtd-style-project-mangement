import React, { Component } from "react";
import ContentEditable from "react-contenteditable";
import { withRouter } from "react-router-dom";
import { DetailDescriptionPane, DetailHeadingPane, Heading } from "../components/common";
import Dropdown from "../components/Dropdown/Dropdown";
import QuickAdd from "../components/QuickAdd/QuickAdd";
import List from "../components/Todo/List";
import { db } from "../db";
import Breadcumb from "../components/Breadcumb/Breadcumb";

class ListDetailPage extends Component {
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
      isEditShown: false,
      projectId: "",
      projectName: ""
    };
    this.projectRef = db.collection("projects").doc(projectId);
    this.listRef = db.collection("lists").doc(listId);
  }

  _handleUpdateList = async ({ text, notes }) => {
    const { projectId, listId } = this.props.match.params;
    this.setState({
      isEditShown: false
    });

    try {
      await this.listRef.update({
        heading: text,
        description: notes
      });
    } catch (error) {
      console.log("error updating list: " + error);
    }
    this.props.projectCon.update({
      lists: {
        ...this.props.projectCon.state.lists,
        [projectId]: {
          ...this.props.projectCon.state.lists[projectId],
          [listId]: {
            ...this.props.projectCon.state.lists[projectId][listId],
            heading: text,
            description: notes
          }
        }
      }
    });
  };

  _handleDeleteList = async () => {
    const { listId, projectId } = this.props.match.params;
    let projectLists = { ...this.props.projectCon.state.lists[projectId] };

    await db
      .collection("lists")
      .doc(listId)
      .delete();

    delete projectLists[listId];

    let todos = { ...this.props.projectCon.state.todos };
    let deletedTodos = { ...todos[listId] };

    Object.keys(deletedTodos).forEach(
      async todoId =>
        await db
          .collection("todo")
          .doc(todoId)
          .delete()
    );

    delete todos[listId];
    this.props.projectCon.update({
      lists: {
        ...this.props.projectCon.state.lists,
        [projectId]: projectLists
      },
      todos
    });
    this.props.history.push(`/projects/${this.props.match.params.projectId}`);
  };

  _handleCloseQuickAdd = () => {
    this.setState({ isAddShown: !this.state.isAddShown });
  };

  _handleToggleQuickAdd = type => {
    const newState =
      type === "add"
        ? { isAddShown: !this.state.isAddShown }
        : { isEditShown: !this.state.isEditShown };
    this.setState(newState);
  };

  render() {
    const { projectId, listId } = this.props.match.params;
    const lists = this.props.projectCon.state.lists;

    return this.props.projectCon.state.isLoading ? (
      <div>loading</div>
    ) : (
      <div>
        <Breadcumb
          projectId={projectId}
          listId={listId}
        />

        {this.state.isEditShown && (
          <QuickAdd
            textPlaceholder="리스트 이름"
            notesPlaceholder="설명(선택)"
            text={lists[projectId][listId].heading}
            notes={lists[projectId][listId].description}
            onSubmit={this._handleUpdateList}
            onCancel={() => this._handleToggleQuickAdd("edit")}
          />
        )}
        {!this.state.isEditShown && (
          <React.Fragment>
            <DetailHeadingPane>
              <Heading>{lists[projectId][listId].heading}</Heading>
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
                <ContentEditable html={lists[projectId][listId].description} disabled={true}/>
            </DetailDescriptionPane>
          </React.Fragment>
        )}
        <List
          projectId={this.props.match.params.projectId}
          listId={this.props.match.params.listId}
          heading={lists[projectId][listId].heading}
          description={lists[projectId][listId].description}
        />
      </div>
    );
  }
}

export default withRouter(ListDetailPage);
