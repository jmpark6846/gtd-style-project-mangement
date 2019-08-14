import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styled from "styled-components";
import { Subscribe } from "unstated";
import "./App.css";
import Header from "./components/Header";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AuthContainer from "./containers/AuthContainer";
import ListDetailPage from "./pages/ListDetailPage";
import ProjectListPage from "./pages/ProjectListPage";
import SignInPage from "./pages/SignInPage";


const Body = styled.section`
  /* position: absolute; */
  margin-top: 60px;
  padding: 0px 30px;
`;

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Header />
          <Body>
            <Subscribe to={[AuthContainer]}>
              {auth => (
                <React.Fragment>
                  <Route
                    exact
                    path="/"
                    render={() => <SignInPage auth={auth} />}
                  />
                  <Route
                    exact
                    path="/projects"
                    render={() => <ProjectListPage auth={auth} />}
                  />
                  <Route
                    exact
                    path="/projects/:projectId"
                    render={() => <ProjectDetailPage auth={auth} />}
                  />
                  <Route
                    path="/projects/:projectId/lists/:listId"
                    component={ListDetailPage}
                  />
                </React.Fragment>
              )}
            </Subscribe>
          </Body>
        </Router>
      </div>
    );
  }
}

export default App;
