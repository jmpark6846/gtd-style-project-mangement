import React from "react";
import { Heading, Button, SubHeading, Input, InputUnderline } from "../components/common";
import { db } from "../db";
import styled from "styled-components";
import SlideContainer from "../components/Slide/SlideContainer";

const TeamBox = styled.div`
  padding: 0.5em 1em;
  border: 1px solid #d9d9d9;
  border-radius: 1.5em;
`;

const Slide = styled.div.attrs(props => ({ width: props.width }))`
  width: ${props => props.width};
  margin-top: -50px;
  margin-bottom: 30px;
`;

class TeamSelectionPage extends React.Component {
  state = {
    name: "",
    teams: {},
    isModalOpen: false,
    currentSlide: 0,
    slideCount: 2
  };

  _sortByCreatedAt = () => {
    return Object.values(this.state.teams).sort(
      (a, b) => a.createdAt - b.createdAt
    );
  };

  _handleAddTeam = () => {};

  render() {
    return (
      <div>
        <Heading>Team</Heading>
        {this._sortByCreatedAt().map(team => (
          <TeamBox>{team.name}</TeamBox>
        ))}
        <Button onClick={this._handleAddTeam}>팀 만들기</Button>
        <SlideContainer
          slideWidth="500px"
          current={this.state.currentSlide}
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
          onSubmit={() => {
            console.log("submit!");
          }}
        >
          <Slide>
            <SubHeading center>프로젝트 추가</SubHeading>
            <Heading>프로젝트 이름부터 지어볼까요?</Heading>
            <InputUnderline value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
          </Slide>
          <Slide>
            <div>2</div>
          </Slide>
        </SlideContainer>
      </div>
    );
  }
}

export default TeamSelectionPage;
