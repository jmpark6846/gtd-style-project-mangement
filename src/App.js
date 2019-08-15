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
import ProjectContainer from "./containers/ProjectContainer";
import { db, firebaseAuth } from "./db";

const Body = styled.section`
  /* position: absolute; */
  margin-top: 60px;
  padding: 0px 30px;
`;

class App extends React.Component {
  usersRef = db.collection("users");
  projectsRef = db.collection("projects");
  listsRef = db.collection("lists");

  componentDidMount = () => {
    const { authCon, projectCon } = this.props;
    // 인증 정보
    firebaseAuth.onAuthStateChanged(async googleAuth => {
      if (googleAuth !== null) {
        let user = null;

        try {
          let userDoc = await this.usersRef.doc(googleAuth.uid).get();
          if (userDoc.exists) {
            user = userDoc.data();
            authCon.setAuth({ ...user, isLoggedIn: true });
          }
        } catch (error) {
          console.log("error getting user: " + error);
        }

        if (user) {
          let projectIds = Object.keys(user.projects || {});
          Promise.all(
            projectIds.map(projectId =>
              this.projectsRef
                .doc(projectId)
                .get()
                .then(projectDoc => {
                  if (projectDoc.exists) {
                    projectCon.update({
                      projects: {
                        ...projectCon.state.projects,
                        [projectId]: projectDoc.data()
                      }
                    });
                  }
                })
                .catch(error => {
                  console.error("error gettings project data: " + error);
                })
            )
          );
        }

        // projectIds.map(projectId =>
        //   this.listRef.child(projectId).on("value", listSnapshot => {
        //     projectCon.update({
        //       lists: {
        //         ...projectCon.state.lists,
        //         [projectId]: listSnapshot.val()
        //       }
        //     });
        //   })
        // );
      }
    });
  };
  componentWillMount = () => {
    // let projectIds = Object.keys(this.props.authCon.state.projects || {});
    // projectIds.map(projectId => this.projectRef.child(projectId).off("value"));
  };
  render() {
    console.log(this.props.authCon);
    console.log(this.props.projectCon);
    return (
      <div className="App">
        <Router>
          <Header />
          <Body>
            <Subscribe to={[AuthContainer, ProjectContainer]}>
              {(auth, project) => (
                <React.Fragment>
                  <Route
                    exact
                    path="/"
                    render={() => <SignInPage authCon={this.props.authCon} />}
                  />
                  <Route
                    exact
                    path="/projects"
                    render={() => <ProjectListPage authCon={this.props.authCon} projectCon={this.props.projectCon} />}
                  />
                  {/* <Route
                    exact
                    path="/projects/:projectId"
                    render={() => <ProjectDetailPage auth={auth} />}
                  />
                  <Route
                    path="/projects/:projectId/lists/:listId"
                    component={ListDetailPage}
                  /> */}
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
