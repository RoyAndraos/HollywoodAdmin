import { useContext, useState } from "react";
import { TextContext } from "../../contexts/TextContext";
import styled from "styled-components";
import { Title } from "../website_images/SlideShowImages";
import { NotificationContext } from "../../contexts/NotficationContext";
import Cookies from "js-cookie";
const SlideShowText = () => {
  const { text, setText } = useContext(TextContext);
  const { setNotification } = useContext(NotificationContext);
  const initialSlideShowtext = text.filter(
    (text) => text._id === "slideshow"
  )[0].content;
  const initialFrenchSlideShowtext = text.filter(
    (text) => text._id === "slideshow"
  )[0].french;
  const [slideShowText, setSlideShowText] = useState(initialSlideShowtext);
  const [frenchSlideShowText, setFrenchSlideShowText] = useState(
    initialFrenchSlideShowtext
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
        textId: "slideshow",
        text: slideShowText,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setText((prevText) => {
            const updatedText = prevText.map((item) => {
              if (item._id === "slideshow") {
                return {
                  ...item,
                  content: slideShowText,
                  french: frenchSlideShowText,
                };
              }
              return item;
            });
            return updatedText;
          });
          setNotification("Slideshow text updated successfully");
        }
      })
      .catch(() => setNotification("Something went wrong"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSlideShowText((prevText) => {
      const newText = [...prevText];
      newText[name] = value;
      return newText;
    });
  };
  const handleChangeFrench = (e) => {
    const { name, value } = e.target;
    setFrenchSlideShowText((prevText) => {
      const newText = [...prevText];
      newText[name] = value;
      return newText;
    });
  };
  return (
    <Wrapper>
      <Title>Slideshow Text</Title>
      <BothLangWrapper>
        <FormWrapper key={"en"}>
          <Language>English</Language>
          {slideShowText.map((elem, index) => (
            <StyledForm key={index + "english"}>
              <StyledInput
                key={"english" + index}
                value={elem}
                name={index}
                onChange={(e) => handleChange(e)}
                placeholder={elem}
              />
            </StyledForm>
          ))}
        </FormWrapper>
        <FormWrapper key={"fr"}>
          <Language>French</Language>
          {frenchSlideShowText.map((elem, index) => (
            <StyledForm key={index + "french"}>
              <StyledInput
                key={"french" + index}
                value={elem}
                name={index}
                onChange={(e) => handleChangeFrench(e)}
                placeholder={elem}
              />
            </StyledForm>
          ))}
        </FormWrapper>
      </BothLangWrapper>
      <SaveButton
        onClick={(e) => handleSubmit(e)}
        disabled={
          initialSlideShowtext[0] === slideShowText[0] &&
          initialSlideShowtext[1] === slideShowText[1] &&
          initialSlideShowtext[2] === slideShowText[2] &&
          initialFrenchSlideShowtext[0] === frenchSlideShowText[0] &&
          initialFrenchSlideShowtext[1] === frenchSlideShowText[1] &&
          initialFrenchSlideShowtext[2] === frenchSlideShowText[2]
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
export const Line = styled.div`
  width: 60%;
  border-bottom: 2px solid #035e3f;
`;
const StyledInput = styled.input`
  padding: 1vh;
  border-radius: 10px;
  border: 2px solid #035e3f;
  outline: none;
  margin-bottom: 1vh;
`;
export const Language = styled.p`
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  text-align: center;
  color: #035e3f;
`;
const BothLangWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 70%;
  padding-bottom: 2rem;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  border-bottom
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
export default SlideShowText;
