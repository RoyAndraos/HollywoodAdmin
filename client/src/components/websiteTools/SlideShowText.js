import { useContext, useState } from "react";
import { TextContext } from "../contexts/TextContext";
import styled from "styled-components";
import { Title } from "./SlideShowImages";
const SlideShowText = () => {
  const { text, setText } = useContext(TextContext);
  const initialSlideShowtext = text.filter(
    (text) => text._id === "slideshow"
  )[0].content;
  const [slideShowText, setSlideShowText] = useState(initialSlideShowtext);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/updateText", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        textId: "slideshow",
        text: slideShowText,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setText((prevText) => {
          const updatedText = prevText.map((item) => {
            if (item._id === "slideshow") {
              return { ...item, content: slideShowText };
            }
            return item;
          });
          return updatedText;
        });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSlideShowText((prevText) => {
      const newText = [...prevText];
      newText[name] = value;
      return newText;
    });
  };

  return (
    <Wrapper>
      <Title>Slideshow Text</Title>
      {slideShowText.map((elem, index) => (
        <form key={index}>
          <StyledInput
            value={elem}
            name={index}
            onChange={(e) => handleChange(e)}
            placeholder={elem}
          />
        </form>
      ))}
      <SaveButton
        onClick={(e) => handleSubmit(e)}
        disabled={
          initialSlideShowtext[0] === slideShowText[0] &&
          initialSlideShowtext[1] === slideShowText[1] &&
          initialSlideShowtext[2] === slideShowText[2]
        }
      >
        Save
      </SaveButton>
    </Wrapper>
  );
};
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  justify-content: space-evenly;
  align-items: center;
  min-height: 30vh;
  border: 2px solid rgba(0, 0, 0, 0.8);
  margin-top: 2rem;
  border-radius: 0.5rem;
`;

const StyledInput = styled.input`
  padding: 1vh;
  border-radius: 10px;
  border: 2px solid #035e3f;
  outline: none;
  margin-bottom: 1vh;
`;

export const SaveButton = styled.button`
  background-color: #035e3f;
  color: whitesmoke;
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 10rem;
  height: 3rem;
  transition: 0.2s ease-in-out;
  &:hover {
    background-color: whitesmoke;
    color: #035e3f;
    border: 2px solid #035e3f;
    cursor: pointer;
  }
  &:disabled {
    background-color: grey;
    color: whitesmoke;
    border: 2px solid transparent;
    cursor: default;
  }
`;
export default SlideShowText;
