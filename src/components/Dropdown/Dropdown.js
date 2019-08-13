import React from "react";
import PropTypes from "prop-types";
import { FiMoreHorizontal } from "react-icons/fi";
import { IconButton, Box, Pane } from "../common";
import styled from "styled-components";
const DropdownMenuPane = styled(Box)`
  position: absolute;
  width: 100px;
  /* box-shadow: rgba(67, 90, 111, 0.3) 0px 0px 1px, rgba(67, 90, 111, 0.47) 0px 8px 10px -4px; */
`;

class Dropdown extends React.Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.menuRef = React.createRef();
  }

  openMenu = e => {
    e.preventDefault();
    this.setState({ open: true }, () => {
      document.addEventListener("click", this.closeMenu);
    });
  };

  closeMenu = e => {
    if (!this.menuRef.current.contains(e.target)) {
      this.setState({ open: false }, () => {
        document.removeEventListener("click", this.closeMenu);
      });
    }
  };
  
  componentWillUnmount() {
    document.removeEventListener("click", this.closeMenu)
  }
  
  render() {
    return (
      <Pane position="relative">
        <IconButton onClick={this.openMenu}>
          <FiMoreHorizontal />
        </IconButton>
        {this.state.open && (
          <DropdownMenuPane ref={this.menuRef}>
            {this.props.children}
          </DropdownMenuPane>
        )}
      </Pane>
    );
  }
}

Dropdown.propTypes = {
  
};

export default Dropdown;
