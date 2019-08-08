import React, {useState} from "react";
import styled from "styled-components";
import Header from "./components/Header";
import './App.css'
import 'codemirror/lib/codemirror.css'
import Chat from "./components/Chat/Chat";
import Code from "./components/Code/Code";


const SharePage = styled.div`
  display: flex;
  height: 100%;
`;

const CodeEditorPane = styled.div`
  flex: 1;
`

const Body = styled.section`
  flex: 1;
  height: 100%;
`


function App() {
  const [ code, setCode ] = useState('')
  return (
    <div className="App">
      <Header />
      <Body>
        <SharePage>
          <Code />
          <Chat />
        </SharePage>
      </Body>
    </div>
  );
}

export default App;
