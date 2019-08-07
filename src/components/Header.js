import React from "react";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  /* border-bottom: 1px solid #dbdbdb; */
  box-sizing: border-box;
  box-shadow: 0 5px 10px 0 rgba(0,64,128,.05);
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

export default function Header() {
  return (
    <Nav>
      
      <Logo>
        CodeShare
      </Logo>
    
      <Menu>
        <MenuItem>Park Joonmo</MenuItem>
      </Menu>
    </Nav>
  );
}
