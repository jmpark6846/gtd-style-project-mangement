import React, {useState} from "react";
import styled from "styled-components";
import Header from "./components/Header";
import './App.css'
import Project from "./components/Todo/List";

const Body = styled.section`
/* position: absolute; */
  margin-top: 60px;
  padding: 0px 30px;
`

function App() {
  return (
    <div className="App">
      <Header />
      <Body>
        <Project />
      </Body>
    </div>
  );
}

export default App;
