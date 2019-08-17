import React from "react";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import { Subscribe } from "unstated";
import AuthContainer from "../containers/AuthContainer";
import { firebaseAuth } from "../db";
import Dropdown from "./Dropdown/Dropdown";
import Breadcumb from "./Breadcumb/Breadcumb";

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
  z-index:999;
`;

const Logo = styled.span`
  font-weight: 700;
  font-size: 1rem;
  /* color: #daa592; */
`;

class Header extends React.Component {
  signOut = async authSignOut => {
    const that = this
    firebaseAuth
      .signOut()
      .then(function() {
        authSignOut();
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
            {/* <Breadcumb
              projectId={projectId}
              listId={listId}
            /> */}
            <Dropdown
              alignRight={true}
              select={auth.state.username}
            >
              <Dropdown.Item onClick={() => this.signOut(auth.signOut)}>로그아웃</Dropdown.Item>
            </Dropdown>
          </Nav>
        )}
      </Subscribe>
    );
  }
}

export default withRouter(Header);
