import React from "react";
import PropTypes from "prop-types";
import { FiMoreHorizontal } from "react-icons/fi";
import { IconButton, Box, Pane } from "../common";
import styled from "styled-components";


const DropdownMenuPane = styled(Box).attrs(props => ({ right: props.right }))`
  margin-top:3px;
  border-radius:0.5rem;
  background-color: white;
  position: absolute;
  width: 150px;
  padding: 0;
  right: ${props => props.right};
  /* box-shadow: rgba(67, 90, 111, 0.3) 0px 0px 1px, rgba(67, 90, 111, 0.47) 0px 8px 10px -4px; */
`;

export const DropdownItem = styled.div`
  cursor:pointer;
  padding: 0.8em 1em;
  background-color:white;

  :first-child{
    border-top-left-radius:inherit;
    border-top-right-radius:inherit;
  }
  :last-child{
    border-bottom-left-radius:inherit;
    border-bottom-right-radius:inherit;
  }
  :hover{
    background-color:lightgray;
  }
`;

class Dropdown extends React.Component {
  static Item = DropdownItem;
  static propTypes = {
    alignRight: PropTypes.bool,
    select:  PropTypes.oneOfType([PropTypes.object,PropTypes.string])
  }

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
    this.setState({ open: false }, () => {
      document.removeEventListener("click", this.closeMenu);
    });
  };

  componentWillUnmount() {
    document.removeEventListener("click", this.closeMenu);
  }

  render() {
    const { select } = this.props;
    return (
      <Pane position="relative">
        {select != null ? (
          <div onClick={this.openMenu}>{select}</div>
        ) : (
          <IconButton onClick={this.openMenu}>
            <FiMoreHorizontal />
          </IconButton>
        )}
        {this.state.open && (
          <DropdownMenuPane right={this.props.alignRight && 0} ref={this.menuRef}>
            {this.props.children}
          </DropdownMenuPane>
        )}
      </Pane>
    );
  }
}

export default Dropdown;



