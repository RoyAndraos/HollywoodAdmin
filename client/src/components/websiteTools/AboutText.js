import { useContext, useState } from "react";
import { TextContext } from "../contexts/TextContext";
import { Title } from "./SlideShowImages";
import { Wrapper, SaveButton, Language, Line } from "./SlideShowText";
import { StyledInput } from "./UnderMenuText";
import { NotificationContext } from "../contexts/NotficationContext";
const AboutText = () => {
  const { text, setText } = useContext(TextContext);
  const { setNotification } = useContext(NotificationContext);
  const initialAboutText = text.filter((text) => text._id === "about")[0]
    .content;
  const [aboutText, setAboutText] = useState(initialAboutText);
  const initialFrenchAboutText = text.filter((text) => text._id === "about")[0]
    .french;
  const [frenchAboutText, setFrenchAboutText] = useState(
    initialFrenchAboutText
  );
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
      .then((result) => {
        if (result.status === 200) {
          setNotification("About text updated successfully");
          setText((prevText) => {
            const updatedText = prevText.map((item) => {
              if (item._id === "about") {
                return { ...item, content: aboutText, french: frenchAboutText };
              }
              return item;
            });
            return updatedText;
          });
        }
      })
      .catch(() => setNotification("Something went wrong"));
  };
  return (
    <Wrapper style={{ marginBottom: "2rem" }}>
      <Title>AboutText</Title>
      <Language>English</Language>
      <StyledInput
        defaultValue={initialAboutText}
        onChange={(e) => {
          setAboutText(e.target.value);
        }}
        style={{ height: "12vh" }}
      ></StyledInput>
      <Language>French</Language>
      <StyledInput
        defaultValue={initialFrenchAboutText}
        onChange={(e) => {
          setFrenchAboutText(e.target.value);
        }}
        style={{ height: "12vh" }}
      ></StyledInput>
      <SaveButton
        onClick={(e) => {
          handleSubmit(e);
        }}
        disabled={
          initialAboutText === aboutText &&
          initialFrenchAboutText === frenchAboutText
        }
      >
        Save
      </SaveButton>
      <Line />
    </Wrapper>
  );
};

export default AboutText;
