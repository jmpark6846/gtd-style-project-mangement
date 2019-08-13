import React from "react";
import { Link } from 'react-router-dom'
import {
  Heading,
  Button,
  SubHeading,
  InputUnderline,
  Box
} from "../components/common";
import { db, firebaseAuth } from "../db";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import SlideContainer, { Slide } from "../components/Slide/SlideContainer";
import { generateId } from "../utils";

const ProjectBox = styled(Box)`
  padding: 0.5em 1em;
  border: 1px solid #d9d9d9;
  border-radius: 1.5em;
`;

class ProjectListPage extends React.Component {
  state = {
    name: "",
    teammate: "",
    projects: [],
    isSlideShown: false,
    currentSlide: 0,
    slideCount: 2
  };

  _sortByCreatedAt = () => {
    return this.state.projects.sort(
      (a, b) => a.createdAt - b.createdAt
    );
  };

  async componentDidMount() {
    firebaseAuth.onAuthStateChanged(googleAuth => {
      if (googleAuth !== null) {
        let user = null;
        db.ref("users")
          .child(googleAuth.uid)
          .once("value", data => {
            user = data.val();
            this.props.auth.setAuth(user);

            let projectIds = Object.keys(user.projects);
            Promise.all(
              projectIds.map(id =>
                db
                  .ref("projects")
                  .child(id)
                  .once("value")
                  .then(snapshot => snapshot.val())
              )
            ).then(result => this.setState({ projects: result}));
          });
      }
    });
  }
  componentWillMount() {
    firebaseAuth.onAuthStateChanged(() => {});
  }

  _handleAddProject = async () => {
    try {
      const id = generateId();
      const { username, id: userId } = this.props.auth.state
      const newProject = {
        id,
        name: this.state.name,
        user: { username, id: userId },
        createdAt: Date.now(),
        description: "",
        lists: {}
      };
      await db.ref("projects/" + id).set(newProject);

      await db
        .ref("users")
        .child(this.props.auth.state.id)
        .update({
          projects: { ...this.props.auth.state.projects, [id]: true }
        });

      this.props.auth.setAuth({
        projects: { ...this.props.auth.state.projects, [id]: true }
      });
      this.setState({
        isSlideShown: false,
        projects: { ...this.state.projects, [id]: newProject }
      });
    } catch (error) {
      console.error("error submit: " + error);
    }
  };

  render() {
    return (
      <div>
        <Heading>Project</Heading>
        {this._sortByCreatedAt().map(project => (
          <Link key={project.id} to={`${this.props.match.path}/${project.id}`}>
          <ProjectBox >
            {project.name}
            </ProjectBox>
            </Link>
        ))}
        <Button onClick={() => this.setState({ isSlideShown: true })}>
          프로젝트 만들기
        </Button>
        <SlideContainer
          current={this.state.currentSlide}
          width="500px"
          show={this.state.isSlideShown}
          onCloseClick={() =>
            this.setState({ isSlideShown: false, name: "", teammate: "" })
          }
          onPrev={() =>
            this.setState(prevState => ({
              currentSlide: prevState.currentSlide - 1
            }))
          }
          onNext={() =>
            this.setState(prevState => ({
              currentSlide: prevState.currentSlide + 1
            }))
          }
          onSubmit={this._handleAddProject}
        >
          <Slide next={this.state.name !== ""}>
            <SubHeading>프로젝트 추가</SubHeading>
            <Heading>프로젝트 이름부터 지어볼까요?</Heading>
            <InputUnderline
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </Slide>
          <Slide>
            <SubHeading>프로젝트 추가</SubHeading>
            <Heading>같이 프로젝트에 참여하는 팀원을 추가해주세요.</Heading>
            <InputUnderline
              value={this.state.teammate}
              placeholder="팀원 Email(선택)"
              onChange={e => this.setState({ teammate: e.target.value })}
            />
          </Slide>
          <Slide submit={true}>
            <Heading>
              그럼 시작해볼까요
              <span role="img" aria-label="smile">
                😃
              </span>
            </Heading>
          </Slide>
        </SlideContainer>
      </div>
    );
  }
}

export default withRouter(ProjectListPage);
