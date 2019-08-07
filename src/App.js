import React from "react";
import styled from "styled-components";
import Header from "./components/Header";
import './App.css'
const SharePage = styled.div`
  display: flex;
  height: 100%;
`;

const CodeEditorPane = styled.div`
  flex: 1;

`
const ChatPane = styled.div`
  width: 350px;
  height: 100%;
  background-color:#e6e6e6;
`
const Body = styled.section`
  flex: 1;
  height: 100%;
`


function App() {
  return (
    <div className="App">
      <Header />
      <Body>
        <SharePage>
          <CodeEditorPane>code editor</CodeEditorPane>
          <ChatPane>chats</ChatPane>
        </SharePage>
      </Body>
    </div>
  );
}

export default App;
