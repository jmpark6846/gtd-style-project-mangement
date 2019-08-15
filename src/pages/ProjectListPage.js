import React from "react";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import {
  Box,
  Button,
  Heading,
  InputUnderline,
  SubHeading
} from "../components/common";
import SlideContainer, { Slide } from "../components/Slide/SlideContainer";
import { db, firebaseAuth } from "../db";
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
    isSlideShown: false,
    currentSlide: 0,
    slideCount: 2
  };
  projectsRef = db.collection("projects");
  
  _handleAddProject = async () => {
    try {
      const projectId = generateId();
      const userId = this.props.authCon.state.id;
      const newProject = {
        id: projectId,
        userId,
        name: this.state.name,
        createdAt: Date.now(),
        description: "",
        lists: {}
      };

      await this.projectsRef.doc(projectId).set(newProject);
      this.props.projectCon.update({
        projects: { 
          ...this.props.projectCon.state.projects,
          [projectId]: newProject
        }
      })

      const authProjectList = {
        ...this.props.authCon.state.projects,
        [projectId]: true
      };
      await db
        .collection("users")
        .doc(userId)
        .update({
          projects: authProjectList
        });

      this.props.authCon.setAuth({
        projects: authProjectList
      });

      this.setState({
        isSlideShown: false,
        currentSlide: 0,
        name: "",
        teammate: "",
      });
    } catch (error) {
      console.error("error adding project: " + error);
    }
  };

  _sortByCreatedAt = () => {
    return Object.values(this.props.projectCon.state.projects).sort(
      (a, b) => a.createdAt - b.createdAt
    );
  };

  render() {
    return (
      <div>
        <Heading>Project</Heading>
        {this._sortByCreatedAt().map(project => (
          <Link key={project.id} to={`${this.props.match.path}/${project.id}`}>
            <ProjectBox>{project.name}</ProjectBox>
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
