import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styled from "styled-components";
import { Subscribe } from "unstated";
import "./App.css";
import Header from "./components/Header";
import AuthContainer from "./containers/AuthContainer";
import ProjectContainer from "./containers/ProjectContainer";
import { db, firebaseAuth } from "./db";
import ProjectListPage from "./pages/ProjectListPage";
import SignInPage from "./pages/SignInPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

const Body = styled.section`
  /* position: absolute; */
  margin-top: 60px;
  padding: 0px 30px;
`;

class App extends React.Component {
  usersRef = db.collection("users");
  projectsRef = db.collection("projects");

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
          await Promise.all(
            projectIds.map(projectId =>
              this.projectsRef
                .doc(projectId)
                .get()
                .then(projectDoc => {
                  if (projectDoc.exists) {
                    projectCon.update({
                      projects:{
                        ...projectCon.state.projects,
                        [projectId]: projectDoc.data()
                      }
                    });
                    // let lists = db.collectionGroup('lists').where("projectId","==",projectId).get().then(snapshot => (
                    //   snapshot.forEach(doc => {
                    //     console.log(doc.data())
                    //   })
                    // ))
                  }
                })
                .catch(error => {
                  console.error("error gettings project data: " + error);
                })
            )
          );

          await Promise.all(
            projectIds.map(projectId =>
              this.projectsRef
                .doc(projectId)
                .collection("lists")
                .get()
                .then(listSnapshot => {
                  if (!listSnapshot.empty) {
                    let _lists = {};
                    listSnapshot.forEach(
                      doc => (_lists[doc.data().id] = doc.data())
                    );
                    projectCon.update({
                      projects: {
                        ...projectCon.state.projects,
                        [projectId]: {
                          ...projectCon.state.projects[projectId],
                          lists: _lists
                        }
                      }
                    });
                  }
                })
                .catch(error => {
                  console.error("error gettings list data: " + error);
                })
            )
          );

          this.props.projectCon.update({ isLoading: false });
        }
      }
    });
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
                    render={() => (
                      <ProjectListPage
                        authCon={this.props.authCon}
                        projectCon={this.props.projectCon}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/projects/:projectId"
                    render={() => (
                      <ProjectDetailPage
                        authCon={this.props.authCon}
                        projectCon={this.props.projectCon}
                      />
                    )}
                  />
                  {/* <Route
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
