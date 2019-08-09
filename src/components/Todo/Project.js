import React, { Component } from "react";
import List from "./List";
import { Button } from "../common";
import { db } from "../../db";
import { generateId, getSortedByOrderProp } from "../../utils";
import QuickAdd from "../QuickAdd/QuickAdd";

export default class Project extends Component {
  state = {
    heading: "",
    description: "",
    lists: {},
    length: 0,
    isAddShown: false
  };
  componentDidMount() {
    db.ref("lists").on("value", data => {
      const lists = data.val() || {};
      this.setState({ lists, length: Object.keys(lists).length });
    });
  }

  componentWillUnmount() {
    db.ref("lists").off("value");
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
      await db.ref("lists/" + id).set({
        ...newList,
        team: "",
        createdAt: Date.now(),
      });

      await db.ref("list/")
    } catch (error) {
      console.error("error _handleAddList: " + error);
    }

    this.setState({
      lists: {
        ...this.state.lists,
        [id]: newList
      },
      length: newList.order,
      isAddShown: false,
    });
  };

  _handleToggleQuickAdd = () => {
    this.setState({ isAddShown: !this.state.isAddShown });
  };

  render() {
    console.log(this.state.lists);
    return (
      <div>
        <div>
          {this.state.isAddShown && (
            <QuickAdd
              type="list"
              onSubmit={this._handleAddList}
              onCancel={this._handleToggleQuickAdd}
            />
          )}
          {!this.state.isAddShown && (
            <Button onClick={this._handleToggleQuickAdd}>새 리스트 추가</Button>
          )}
        </div>
        {getSortedByOrderProp(this.state.lists).map(list => (
          <List key={list.id} {...list}/>
        ))}
      </div>
    );
  }
}
