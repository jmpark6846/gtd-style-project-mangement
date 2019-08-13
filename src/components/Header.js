import React from "react";
import { withRouter, Link } from "react-router-dom";
import styled from "styled-components";
import { Subscribe } from "unstated";
import AuthContainer from "../containers/AuthContainer";
import { firebaseAuth } from "../db";

const Nav = styled.nav`
  position: fixed;
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #fdfdfd;
  box-sizing: border-box;
  box-shadow: 0 5px 10px 0 rgba(0, 64, 128, 0.05);
  /* box-shadow: 0 4px 11px rgba(0,0,0,0.1); */
  background-color: #ffffff;
  height: 50px;
  align-items: center;
`;

const Menu = styled.ul`
  display: flex;
  list-style: none;
`;

const MenuItem = styled.li`
  margin-left: 15px;
`;
const Logo = styled.span`
  font-weight: 700;
  font-size: 1rem;
  /* color: #daa592; */
`;

class Header extends React.Component {
  signOut = async authContainerSignOut => {
    const that = this
    firebaseAuth
      .signOut()
      .then(function() {
        authContainerSignOut();
        that.props.history.push("/");
      })
      .catch(function(error) {
        console.error("error signout: " + error);
      });
  };

  render() {
    return (
      <Subscribe to={[AuthContainer]}>
        {auth => (
          <Nav>
            <Logo><Link to={`/projects`} >projects</Link></Logo>
            <Menu>
              <MenuItem onClick={() => this.signOut(auth.signOut)}>
                {auth.state.username}
              </MenuItem>
            </Menu>
          </Nav>
        )}
      </Subscribe>
    );
  }
}

export default withRouter(Header);
