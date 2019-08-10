import React from "react";
import { Heading, Button, SubHeading, Input } from "../components/common";
import { db } from "../db";
import styled from "styled-components";
import SlideContainer from "../components/Slide/SlideContainer";
import Slide from "../components/Slide/Slide";

const TeamBox = styled.div`
  padding: 0.5em 1em;
  border: 1px solid #d9d9d9;
  border-radius: 1.5em;
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
            <div>1</div>
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
