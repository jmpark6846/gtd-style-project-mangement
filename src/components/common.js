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

  font-size: ${props => props.small && "0.9rem" };
  padding-top: ${props => props.small && "0.425em;" };
  padding-bottom: ${props => props.small && "0.425em;" };
`;

export const IconButton = styled(Button)`
  padding: 0.5rem;
  line-height: 1;
  font-size:1rem;
`


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

export const Heading = styled.h2`
  font-weight: 700;
  font-size: 1.5rem;
  /* margin-bottom: 10px; */
`

export const SmallHeading = styled.h3`
  font-weight: 600;
  font-size: 1.2rem;
  /* margin-bottom: 10px; */
`


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

