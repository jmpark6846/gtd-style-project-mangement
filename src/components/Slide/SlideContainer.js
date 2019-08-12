import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import { Button, Pane } from "../common";

const SlideContainerPane = styled.div.attrs(props => ({ show: props.show }))`
  display: ${props => (props.show ? "block" : "none")};
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
`;

export const Slide = styled.div.attrs(props => ({ width: props.width }))`
  width: ${props => props.width || "100%"};
`;

const SlideControlPane = styled(Pane)`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

export default class SlideContainer extends Component {
  static propTypes = {
    current: PropTypes.number
  };
  handlePrev = () => {
    if (this.props.current < 0) {
      throw new RangeError("슬라이드 인덱스는 0 보다 작을 수 없습니다.");
    }
    this.props.onPrev();
  };
  handleNext = () => {
    if (this.props.current > this.props.children.length - 1) {
      throw new RangeError(
        "슬라이드 인덱스는 슬라이드 갯수보다 클 수 없습니다."
      );
    }
    this.props.onNext();
  };
  render() {
    const slidesLength = this.props.children.length;
    const slide = this.props.children[this.props.current];
    return (
      <SlideContainerPane show={this.props.show}>
        <MdClose onClick={this.props.onCloseClick} />
        <Pane width={this.props.width}>
          {slide}
          <SlideControlPane>
            {this.props.current !== 0 && (
              <Button onClick={this.handlePrev}>prev</Button>
            )}
            {this.props.current < slidesLength - 1 ? (
              <Button
                onClick={this.handleNext}
                disabled={
                  slide.props.next === undefined ? false : !slide.props.next
                }
              >
                next
              </Button>
            ) : (
              <Button
                onClick={this.props.onSubmit}
                disabled={
                  slide.props.next === undefined ? false : !slide.props.submit
                }
              >
                submit
              </Button>
            )}
          </SlideControlPane>
        </Pane>
      </SlideContainerPane>
    );
  }
}
