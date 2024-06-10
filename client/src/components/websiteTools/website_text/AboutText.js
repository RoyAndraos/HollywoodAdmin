import { useContext, useState } from "react";
import { TextContext } from "../../contexts/TextContext";
import { Title } from "../website_images/SlideShowImages";
import { StyledInput } from "./UnderMenuText";
import { NotificationContext } from "../../contexts/NotficationContext";
import Cookies from "js-cookie";
import styled from "styled-components";
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
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    e.preventDefault();
    fetch("https://hollywood-fairmount-admin.onrender.com/updateText", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        textId: "about",
        content: aboutText,
        french: frenchAboutText,
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

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  justify-content: space-evenly;
  align-items: center;
  min-height: 30vh;
  margin-top: 2rem;
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
  margin-top: 3vh;
  margin-bottom: 3vh;
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

export const Language = styled.p`
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  text-align: center;
  color: #035e3f;
`;

export const Line = styled.div`
  width: 60%;
  border-bottom: 2px solid #035e3f;
`;

export default AboutText;
