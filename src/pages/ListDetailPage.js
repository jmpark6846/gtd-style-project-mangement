import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QuickAdd from '../components/QuickAdd/QuickAdd';
import { DetailHeadingPane, Heading, DetailDescriptionPane, IconButton } from '../components/common';
import { FiMoreHorizontal } from 'react-icons/fi';
import { getSortedByOrderProp } from '../utils';
import ContentEditable from 'react-contenteditable';
import List from '../components/Todo/List';
import { db } from '../db';

export default class ListDetailPage extends Component {
  // static propTypes = {
  //   prop: PropTypes
  // } 
  constructor(props) {
    super(props)
    const { teamId, listId } = this.props.match.params

    this.state = {
      id: listId || "",
      heading: "",
      description: "",
      lists: {},
      length: 0,
      isAddShown: false,
      isEditShown: false
    }
    this.listRef = db.ref(`lists/${teamId}/${listId}`);
  }

  componentDidMount() {
    this.listRef.on("value", data => {
      const lists = data.val() || {};
      this.setState({ lists, length: Object.keys(lists).length });
    });
  }

  componentWillUnmount() {
    this.listRef.off("value");
  }
  
  render() {
    return (
      <div>
        hi
        {/* {this.state.isEditShown && (
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

        {getSortedByOrderProp(this.state.lists).map(list => (
          <List
            key={list.id}
            projectId={this.state.id}
            listId={list.id}
            heading={list.heading}
            description={list.description}
          />
        ))}         */}
      </div>
    )
  }
}
