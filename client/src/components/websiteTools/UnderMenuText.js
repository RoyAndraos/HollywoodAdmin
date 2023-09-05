import { useContext, useState } from "react";
import { TextContext } from "../contexts/TextContext";
import { Title } from "./SlideShowImages";
import { Wrapper, SaveButton } from "./SlideShowText";
import styled from "styled-components";
const UnderMenuText = () => {
  const { text, setText } = useContext(TextContext);
  const initialUnderMenuText = text.filter(
    (text) => text._id === "underMenu"
  )[0].content;
  const [underMenuText, setUnderMenuText] = useState(initialUnderMenuText);
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/updateText", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        textId: "underMenu",
        text: underMenuText,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setText((prevText) => {
          const updatedText = prevText.map((item) => {
            if (item._id === "underMenu") {
              return { ...item, content: underMenuText };
            }
            return item;
          });
          return updatedText;
        });
      });
  };

  return (
    <Wrapper>
      <Title>Under Menu Text</Title>
      <StyledInput
        defaultValue={underMenuText}
        onChange={(e) => setUnderMenuText(e.target.value)}
      ></StyledInput>
      <SaveButton
        onClick={(e) => handleSubmit(e)}
        disabled={underMenuText === initialUnderMenuText}
      >
        Save
      </SaveButton>
    </Wrapper>
  );
};
export const StyledInput = styled.textarea`
  padding: 1vh;
  font-family: sans-serif;
  font-size: 1.1rem;
  border-radius: 10px;
  border: 2px solid #035e3f;
  outline: none;
  width: 50%;
  resize: vertical;
  overflow-y: auto;
  text-align: center;
`;
export default UnderMenuText;
