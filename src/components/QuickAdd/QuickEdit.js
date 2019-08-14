import PropTypes from "prop-types";
import React, { Component } from "react";
import ContentEditable from "react-contenteditable";
import { Box, Input, Button } from "../common";

let compositionend = true;

export default class QuickEdit extends Component {
  static propTypes = {
    textPlaceholder: PropTypes.string,
    notesPlaceholder: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    text: PropTypes.string,
    notes: PropTypes.string
  };

  _handleKeyDown = e => {
    if (e.key === "Enter") {
      if (!compositionend || this.props.text === "") {
        return;
      }
      this.props.onSubmit({ text: this.props.text, notes: this.props.notes });
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
          value={this.props.text}
          placeholder={this.props.textPlaceholder}
          onCompositionStart={this.handleComposition}
          onCompositionUpdate={this.handleComposition}
          onCompositionEnd={this.handleComposition}
          onKeyDown={this._handleKeyDown}
          onChange={e =>
            this.props.onChange({ target: "textEdit", value: e.target.value })
          }
        />
        <ContentEditable
          html={this.props.notes}
          placeholder={this.props.notesPlaceholder}
          onChange={e =>
            this.props.onChange({ target: "notesEdit", value: e.target.value })
          }
        />
        {this.props.children}
        <div>
          <Button
            small
            onClick={() =>
              this.props.onSubmit({
                text: this.props.text,
                notes: this.props.notes
              })
            }
          >
            변경사항 저장
          </Button>
          <Button small onClick={this.props.onCancel}>
            취소
          </Button>
        </div>
      </Box>
    );
  }
}
