import React, { Component } from "react";
import PropTypes from "prop-types";

export default class QuickAdd extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  };

  state = {
    text: ""
  };

  _handleKeyDown = ({ key }) => {
    if (key === "Enter") {
      this.props.onSubmit({ text: this.state.text });
      this.setState({ text: "" });
    } else if (key === "Escape") {
      this.props.onCancel()
    }
  };

  render() {
    return (
      <div>
        <input
          value={this.state.text}
          placeholder="할 일"
          onKeyDown={evt => this._handleKeyDown(evt)}
          onChange={evt => this.setState({ text: evt.target.value })}
        />
      </div>
    );
  }
}
