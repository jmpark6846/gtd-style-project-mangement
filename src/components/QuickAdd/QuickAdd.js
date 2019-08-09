import React, { Component } from "react";
import PropTypes from "prop-types";
import { Box, Input } from "../common";
import ContentEditable from "react-contenteditable";

let compositionend = true;
let placeholderTexts = {
  list: {
    text: "새 리스트",
    notes: "설명(선택)",
  },
  todo: {
    text: "새 할 일",
    notes: "노트(선택)"
  }
}

export default class QuickAdd extends Component {
  static propTypes = {
    type: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  };
  static defaultProps = {
    type: "todo",
  }
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
          placeholder={placeholderTexts[this.props.type].text}
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
          placeholder={placeholderTexts[this.props.type].notes}
          onChange={evt => {
            this.setState({ notes: evt.target.value });
          }}
        />
      </Box>
    );
  }
}
