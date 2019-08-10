import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import styled from "styled-components";
import Header from "./components/Header";
import "./App.css";
import Team from "./components/Todo/Team";
import ListDetailPage from "./pages/ListDetailPage";
import IndexPage from "./pages/IndexPage";
import TeamSelectionPage from "./pages/TeamSelectionPage";

const Body = styled.section`
  /* position: absolute; */
  margin-top: 60px;
  padding: 0px 30px;
`;

function App() {
  return (
    <div className="App">
      <Header />
      <Body>
        <Router>
          <Route exact path="/" component={TeamSelectionPage} />
          {/* <Route exact path="/" component={IndexPage} /> */}
          <Route path="/:teamId" component={Team} />
          <Route path="/:teamId/lists/:listId" component={ListDetailPage} />
          {/* <Route path="/signin" component={SignInPage} />
        <Route path="/signup" component={SignUpPage} /> */}
        </Router>
      </Body>
    </div>
  );
}

export default App;
