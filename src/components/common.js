import styled from "styled-components";

export const Button = styled.button.attrs(props => ({ margin: props.margin }))`
  display: ${props => (props.hidden ? "hidden" : "inline-block")};
  margin: ${props => props.margin};
  max-width: 100%;
  padding: 0.5em 1.2em;
  border: 1px solid #d9d9d9;
  border-radius: 1.5em;
  line-height: 1.5;
  background-color: #fff;
  vertical-align: middle;
  text-decoration: none;
  text-align: center;
  white-space: normal;
  cursor: pointer;

  font-size: ${props => props.small && "0.9rem"};
  padding-top: ${props => props.small && "0.425em;"};
  padding-bottom: ${props => props.small && "0.425em;"};
  border: ${props => props.minimal && "none"};

  :hover {
    background-color: #f7f7f7;
  }
`;

export const IconButton = styled(Button)`
  padding: 0.5rem;
  line-height: 1;
  font-size: 1rem;
`;

export const Pane = styled.div.attrs(props => ({
  width: props.width,
  position: props.position,
  padding: props.padding,
  marginTop: props.marginTop,
  marginBottom: props.marginBottom,
  marginLeft: props.marginLeft
}))`
  width: ${props => props.width};
  position: ${props => props.position};
  padding: ${props => props.padding};
  margin-top: ${props => props.marginTop};
  margin-bottom: ${props => props.marginBottom};
  margin-left: ${props => props.marginLeft};
`;

export const Box = styled(Pane)`
  border: 1px solid #d9d9d9;
  border-radius: 1rem;
  padding: 1em 1.5em;
  box-shadow: 0 5px 10px 0 rgba(0, 64, 128, 0.05);
`;

export const Input = styled.input.attrs(props=>({marginBottom: props.marginBottom}))`
  width: 100%;
  border: ${props => (props.minimal ? "none" : "initial")};
  margin-bottom: ${props => (props.marginBottom)};
`;

export const InputUnderline = styled(Input)`
  padding: 5px 2px;
  box-shadow: -8px 10px 0px -8px #ebebeb, 8px 10px 0px -8px #ebebeb;
  -webkit-transition: box-shadow 0.1s;
  transition: box-shadow 0.1s;

  :focus {
    outline: none;
    box-shadow: -8px 10px 0px -8px #4ea6ea, 8px 10px 0px -8px #4ea6ea;
  }
`;

export const Checkbox = styled.input.attrs(props => ({
  type: "checkbox"
}))`
  margin-right: 5px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  border: ${props => (props.minimal ? "none" : "initial")};
`;

export const Heading = styled.h2`
  font-weight: 700;
  font-size: 1.7rem;
  /* margin-bottom: 10px; */
`;

export const SubHeading = styled.h3.attrs(props => ({
  color: props.color
}))`
  color: ${props => props.color};
  font-weight: 600;
  font-size: 1.3rem;
  text-align: ${props => props.center && "center"};
`;

export const HeadingPane = styled(Pane)`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

export const DescriptionPane = styled.div`
  color: gray;
`;
