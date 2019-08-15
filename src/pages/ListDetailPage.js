import React, { Component } from "react";
import ContentEditable from "react-contenteditable";
import { withRouter } from "react-router-dom";
import {
  DetailDescriptionPane,
  DetailHeadingPane,
  Heading
} from "../components/common";
import Dropdown from "../components/Dropdown/Dropdown";
import QuickAdd from "../components/QuickAdd/QuickAdd";
import List from "../components/Todo/List";
import { db } from "../db";
import Breadcumb from "../components/Breadcumb/Breadcumb";

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
      length: 0,
      isAddShown: false,
      isEditShown: false,
      projectId: "",
      projectName: ""
    };
    this.projectRef = db.ref(`projects/${projectId}`);
    this.listRef = db.ref(`lists/${projectId}/${listId}`);
  }

  componentDidMount() {
    this.projectRef.once("value", data => {
      const { name } = data.val();
      this.setState({ projectName: name });
    });
    this.listRef.on("value", data => {
      this.setState(data.val() || {});
    });
  }

  componentWillUnmount() {
    this.listRef.off("value");
  }

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

  _handleDeleteList = () => {
    this.listRef.set(null).catch(error => console.error(error));
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
    return (
      <div>
        <Breadcumb
          projectId={this.state.projectId}
          projectName={this.state.projectName}
          listId={this.state.id}
          listHeading={this.state.heading}
        />

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
        <List
          projectId={this.props.match.params.projectId}
          listId={this.props.match.params.listId}
          heading={this.state.heading}
          description={this.state.description}
        />
      </div>
    );
  }
}

export default withRouter(ListDetailPage);
