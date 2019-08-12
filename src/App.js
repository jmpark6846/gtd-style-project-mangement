import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import styled from "styled-components";
import Header from "./components/Header";
import "./App.css";
import Project from "./components/Todo/Project";
import ListDetailPage from "./pages/ListDetailPage";
import SignInPage from "./pages/SignInPage";
import ProjectListPage from "./pages/ProjectListPage";
import { Provider, Subscribe } from "unstated";
import AuthContainer from "./containers/AuthContainer";

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
        <Provider>
          <Subscribe to={[AuthContainer]}>
            {auth => (
              <Router>
                <Route exact path="/" render={() => <SignInPage auth={auth}/>} />
                <Route exact path="/projects" render={() => <ProjectListPage auth={auth}/>} />
                <Route exact path="/projects/:projectId" component={Project} />
                <Route
                  path="/projects/:projectId/lists/:listId"
                  component={ListDetailPage}
                />
              </Router>
            )}
          </Subscribe>
        </Provider>
      </Body>
    </div>
  );
}

export default App;
