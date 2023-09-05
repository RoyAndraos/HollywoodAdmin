import { useContext, useState } from "react";
import { TextContext } from "../contexts/TextContext";
import { Title } from "./SlideShowImages";
import { Wrapper, SaveButton } from "./SlideShowText";
import { StyledInput } from "./UnderMenuText";
const AboutText = () => {
  const { text, setText } = useContext(TextContext);
  const initialAboutText = text.filter((text) => text._id === "about")[0]
    .content;
  const [aboutText, setAboutText] = useState(initialAboutText);
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/updateText", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        textId: "about",
        text: aboutText,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setText((prevText) => {
          const updatedText = prevText.map((item) => {
            if (item._id === "about") {
              return { ...item, content: aboutText };
            }
            return item;
          });
          return updatedText;
        });
      });
  };
  return (
    <Wrapper style={{ marginBottom: "2rem" }}>
      <Title>AboutText</Title>
      <StyledInput
        defaultValue={initialAboutText}
        onChange={(e) => {
          setAboutText(e.target.value);
        }}
        style={{ height: "12vh" }}
      ></StyledInput>
      <SaveButton
        onClick={(e) => {
          handleSubmit(e);
        }}
        disabled={initialAboutText === aboutText}
      >
        Save
      </SaveButton>
    </Wrapper>
  );
};

export default AboutText;
