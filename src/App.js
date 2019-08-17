import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import Header from "./components/Header";
import { db, firebaseAuth } from "./db";
import ListDetailPage from "./pages/ListDetailPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectListPage from "./pages/ProjectListPage";
import SignInPage from "./pages/SignInPage";

const Body = styled.section`
  /* position: absolute; */
  width: 900px;
  margin: 75px auto 0px auto;
  padding: 0px 30px;
  background-color: white;
  padding: 1.5rem 2rem;
  border-radius: 5px;
  box-shadow: 0 5px 10px 0 rgba(0,64,128,0.05);
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
          let projects = {};
          await Promise.all(
            projectIds.map(projectId =>
              this.projectsRef
                .doc(projectId)
                .get()
                .then(projectDoc => {
                  if (projectDoc.exists) {
                    projects[projectDoc.id] = projectDoc.data();
                  }
                })
                .catch(error => {
                  console.error("error gettings project data: " + error);
                })
            )
          );

          await Promise.all(
            projectIds.map(projectId => {
              projects[projectId].members.map(memberId =>
                db
                  .collection("users")
                  .doc()
                  .get()
                  .then(projectDoc => {
                    if (projectDoc.exists) {
                      projects[projectDoc.id] = projectDoc.data();
                    }
                  })
                  .catch(error => {
                    console.error("error gettings project data: " + error);
                  })
              );
            })
          );

          let lists = {};
          let listIds = [];
          await Promise.all(
            projectIds.map(projectId =>
              db
                .collection("lists")
                .where("projectId", "==", projectId)
                .get()
                .then(listsSnapshot => {
                  if (!listsSnapshot.empty) {
                    listsSnapshot.forEach(doc => {
                      const list = doc.data();
                      lists[projectId] = {
                        ...lists[projectId],
                        [list.id]: list
                      };
                      listIds.push(list.id);
                    });
                  }
                })
                .catch(error => {
                  console.error("error gettings list data: " + error);
                })
            )
          );
          let todos = {};
          await Promise.all(
            listIds.map(listId =>
              db
                .collection("todos")
                .where("listId", "==", listId)
                .get()
                .then(todosSnapshot => {
                  if (!todosSnapshot.empty) {
                    todosSnapshot.forEach(doc => {
                      const todo = doc.data();
                      todos[listId] = {
                        ...todos[listId],
                        [todo.id]: todo
                      };
                    });
                  }
                })
                .catch(error => {
                  console.error("error gettings list data: " + error);
                })
            )
          );
          projectCon.update({
            projects,
            lists,
            todos,
            isLoading: false
          });
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
              <Route
                path="/projects/:projectId/lists/:listId"
                render={() => (
                  <ListDetailPage
                    authCon={this.props.authCon}
                    projectCon={this.props.projectCon}
                  />
                )}
              />
            
          </Body>
        </Router>
      </div>
    );
  }
}

export default App;
