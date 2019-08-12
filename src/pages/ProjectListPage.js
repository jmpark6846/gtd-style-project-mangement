import React from "react";
import {
  Heading,
  Button,
  SubHeading,
  InputUnderline,
  Box
} from "../components/common";
import { db } from "../db";
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
    teammate:"",
    teams: {},
    isSlideShown: false,
    currentSlide: 0,
    slideCount: 2
  };

  _sortByCreatedAt = () => {
    return Object.values(this.state.teams).sort(
      (a, b) => a.createdAt - b.createdAt
    );
  };

  _handleAddTeam = () => {
    
  };

  render() {
    return (
      <div>
        <Heading>Project</Heading>
        {this._sortByCreatedAt().map(project => (
          <ProjectBox>{project.name}</ProjectBox>
        ))}
        <Button onClick={()=>this.setState({ isSlideShown: true})}>프로젝트 만들기</Button>
        <SlideContainer
          current={this.state.currentSlide}
          width="500px"
          show={this.state.isSlideShown}
          onCloseClick={()=>this.setState({ isSlideShown: false, name:"", teammate:""})}
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
          onSubmit={async () => {
            try {
              const id = generateId()
              await db.ref("projects/" + id).set({ 
                id,
                name: this.state.name,
                createdAt: Date.now(),
                description:"",
                lists:{},
              })
              this.props.history.push(`projects/${id}`)
            } catch (error) {
              console.error("error submit: "+error)
            }
          }}
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
          <Heading>그럼 시작해볼까요<span role="img" aria-label="smile">😃</span></Heading>
          </Slide>
        </SlideContainer>
      </div>
    );
  }
}

export default withRouter(ProjectListPage);
