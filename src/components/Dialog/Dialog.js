import React, { Component } from "react";
import PropTypes from "prop-types";
import { Pane, Box } from "../common";
import styled from "styled-components";

const DialogBackground = styled.div`
  display:flex;
  background-color: rgba(67, 90, 111, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const DialogBox = styled(Box)`
  margin: 0 auto;
  height: fit-content;
  background-color: white;
  margin-top: 40px;
  box-shadow: rgba(67, 90, 111, 0.3) 0px 0px 1px, rgba(67, 90, 111, 0.47) 0px 16px 24px -8px;
  border-width:0;
  width: 560px;
  max-width: calc(100% - 70px);

`

export default class Dialog extends Component {
  static propTypes = {
    onClose: PropTypes.func
  };
  boxRef = React.createRef();

  componentDidMount() {
    document.addEventListener("click", this.closeMenu);
  }

  closeMenu = e => {
    if (!this.boxRef.current.contains(e.target)) {
      document.removeEventListener("click", this.closeMenu);
      this.props.onClose();  
    }
  };

  componentWillUnmount() {
    document.removeEventListener("click", this.closeMenu);
  }

  render() {
    return (
      <DialogBackground>
        <DialogBox ref={this.boxRef} position="relative">{this.props.children}</DialogBox>
      </DialogBackground>
    );
  }
}
