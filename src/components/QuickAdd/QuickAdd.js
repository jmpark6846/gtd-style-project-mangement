import React, { Component } from "react";
import PropTypes from "prop-types";

let compositionend = true;
export default class QuickAdd extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  };

  state = {
    text: ""
  };

  _handleKeyDown = e => {
    if (e.key === "Enter") {
      if (!compositionend) {
        return
      }
      this.props.onSubmit({ text: this.state.text });
      this.setState({ text: "" });
    } else if (e.key === "Escape") {
      this.props.onCancel();
    }
  };
  handleComposition = event => {
    compositionend = event.type === "compositionend"
  };
  render() {
    return (
      <div>
        <input
          value={this.state.text}
          placeholder="할 일"
          onCompositionStart={this.handleComposition}
          onCompositionUpdate={this.handleComposition}
          onCompositionEnd={this.handleComposition}
          onKeyDown={evt => {
            // console.log("onkeydown");
            this._handleKeyDown(evt);
          }}
          onChange={evt => {
            // console.log("called");
            this.setState({ text: evt.target.value });
          }}
        />
        
      </div>
    );
  }
}
