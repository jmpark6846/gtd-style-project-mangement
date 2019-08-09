import React, { Component } from "react";
import PropTypes from "prop-types";
import { Box, Input } from "../common";
import ContentEditable from "react-contenteditable";

let compositionend = true;
export default class QuickAdd extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  };

  state = {
    text: "",
    notes: ""
  };

  _handleKeyDown = e => {
    if (e.key === "Enter") {
      if (!compositionend || this.state.text === "") {
        return;
      }
      this.props.onSubmit({ text: this.state.text, notes: this.state.notes });
      this.setState({ text: "", notes: "" });
    } else if (e.key === "Escape") {
      this.props.onCancel();
    }
  };
  handleComposition = event => {
    compositionend = event.type === "compositionend";
  };

  render() {
    return (
      <Box>
        <Input
          value={this.state.text}
          placeholder="할 일"
          onCompositionStart={this.handleComposition}
          onCompositionUpdate={this.handleComposition}
          onCompositionEnd={this.handleComposition}
          onKeyDown={this._handleKeyDown}
          onChange={evt => {
            this.setState({ text: evt.target.value });
          }}
        />
        <ContentEditable
          html={this.state.notes}
          placeholder="노트(선택)"
          onChange={evt => {
            this.setState({ notes: evt.target.value });
          }}
        />
      </Box>
    );
  }
}
