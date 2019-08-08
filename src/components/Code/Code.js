import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import styled from "styled-components";

import 'codemirror/lib/codemirror.css'


const CodeEditorPane = styled.div`
  flex: 1;
`;

export default class Code extends Component {
  state = {
    code: ""
  };
  render() {
    return (
      <CodeEditorPane>
        <CodeMirror
          value={this.state.code}
          onBeforeChange={(editor, data, value) =>
            this.setState({ code: value })
          }
        />
      </CodeEditorPane>
    );
  }
}
