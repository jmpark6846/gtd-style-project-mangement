import styled from "styled-components";

export const Button = styled.button`
  display: ${props => (props.hidden ? "hidden" : "inline-block")};
  max-width: 100%;
  padding: 0.5em 1em;
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
`;

export const IconButton = styled(Button)`
  padding: 0.5rem;
  line-height: 1;
  font-size: 1rem;
`;

export const Box = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 1rem;
  padding: 1em 1.5em;
`;

export const Input = styled.input`
  width: 100%;
  border: ${props => (props.minimal ? "none" : "initial")};
`;

export const InputUnderline = styled(Input)`
  padding:5px 2px;  
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
  font-size: 1.5rem;
  /* margin-bottom: 10px; */
`;

export const SubHeading = styled.h3`
  font-weight: 600;
  font-size: 1.2rem;
  text-align: ${props=>props.center && "center"};
`;

export const DetailHeadingPane = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3px;
`;
  
export const DetailDescriptionPane = styled.div`
  text-align: center;
  color: gray;
  margin-bottom: 20px;
`;

export const Pane = styled.div.attrs(props => ({
  width: props.width,
  position: props.position
}))`
  width: ${props => props.width};
  position: ${props => props.position}
`;