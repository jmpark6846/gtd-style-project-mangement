import React, { Component } from 'react'
import PropTypes from "prop-types";

export default class QuickAdd extends Component {
  static propTypes = {
    onSubmit: PropTypes.func
  }

  state = {
    text:""
  }

  _handleKeyDown = ({ keyCode }) => {
    const { text } = this.state
    if (keyCode === 13) {
      this.props.onSubmit({ text })
      this.setState({text:""})
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