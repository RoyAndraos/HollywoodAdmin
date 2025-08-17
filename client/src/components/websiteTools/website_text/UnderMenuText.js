import { useContext, useState } from "react";
import { Title } from "./AboutText";
import { Wrapper, SaveButton, Language, Line } from "./AboutText";
import styled from "styled-components";
import { NotificationContext } from "../../contexts/NotficationContext";
import Cookies from "js-cookie";
const UnderMenuText = ({ text, setText }) => {
  const { setNotification } = useContext(NotificationContext);
  const initialUnderMenuText = text.filter(
    (text) => text._id === "underMenu"
  )[0].content;
  const [underMenuText, setUnderMenuText] = useState(initialUnderMenuText);
  const initialFrenchMenuText = text.filter(
    (text) => text._id === "underMenu"
  )[0].french;
  const [frenchMenuText, setFrenchMenuText] = useState(initialFrenchMenuText);
  const handleSubmit = (e) => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    e.preventDefault();
    fetch("http://localhost:4000/updateText", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        textId: "underMenu",
        content: underMenuText,
        french: frenchMenuText,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setText((prevText) => {
            const updatedText = prevText.map((item) => {
              if (item._id === "underMenu") {
                return {
                  ...item,
                  content: underMenuText,
                  french: frenchMenuText,
                };
              }
              return item;
            });
            return updatedText;
          });
          setNotification("Under menu text updated successfully");
        }
      })
      .catch(() => setNotification("Something went wrong"));
  };

  return (
    <Wrapper>
      <Title>Under Menu Text</Title>
      <Language>English</Language>
      <StyledInput
        defaultValue={underMenuText}
        onChange={(e) => setUnderMenuText(e.target.value)}
      ></StyledInput>
      <Language>French</Language>
      <StyledInput
        defaultValue={frenchMenuText}
        onChange={(e) => setFrenchMenuText(e.target.value)}
      ></StyledInput>
      <SaveButton
        onClick={(e) => handleSubmit(e)}
        disabled={
          frenchMenuText === initialFrenchMenuText &&
          underMenuText === initialUnderMenuText
        }
      >
        Save
      </SaveButton>
      <Line />
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
