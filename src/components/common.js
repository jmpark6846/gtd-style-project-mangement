import styled from "styled-components";

export const Button = styled.button`
  max-width: 100%;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  line-height: 1.5;
  display: inline-block;
  padding: 0.5em 1em;
  border-radius: 1.5em;
  vertical-align: middle;
  text-decoration: none;
  text-align: center;
  white-space: normal;
  cursor: pointer;
`;

export const Box = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 0.4rem;
  padding: 0.7em 1em;
`;

export const Input = styled.input`
  width: 100%;
  border: ${props => (props.minimal ? "no ne" : "initial")};
`;

export const Textarea = styled.textarea`
  width:100%;
  border: ${props => (props.minimal ? "none" : "initial")};
`