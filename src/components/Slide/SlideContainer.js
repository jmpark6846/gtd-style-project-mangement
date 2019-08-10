import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "../common";

const SlideContainerPane = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default class SlideContainer extends Component {
  static propTypes = {
    current: PropTypes.number
  };
  handlePrev = () => {
    if (this.props.current < 0) {
      throw new RangeError("슬라이드 인덱스는 0 보다 작을 수 없습니다.")
    }
    this.props.onPrev()
  }
  handleNext = () => {
    if (this.props.current > this.props.children.length - 1) {
      throw new RangeError("슬라이드 인덱스는 슬라이드 갯수보다 클 수 없습니다.")
    }
    this.props.onNext()
  }
  render() {
    const slidesLength = this.props.children.length
    return (
      <SlideContainerPane>
        {this.props.children[this.props.current]}
        <div>
          <Button onClick={this.handlePrev} hidden={this.props.current === 0}>prev</Button>
          {this.props.current < slidesLength - 1 ? 
            <Button onClick={this.handleNext}>next</Button>
            :
            <Button onClick={this.props.onSubmit}>submit</Button>
          }
          
        </div>
      </SlideContainerPane>
    );
  }
}