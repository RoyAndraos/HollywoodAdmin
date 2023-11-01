import React, { useContext } from "react";
import { ImageContext } from "../../contexts/ImageContext.js";
import { NotificationContext } from "../../contexts/NotficationContext.js";
import { styled } from "styled-components";
import Cookies from "js-cookie";

const ConfirmDelete = ({ setConfirmDelete, selectedImageToDelete }) => {
  const { setNotification } = useContext(NotificationContext);
  const { images, setImages } = useContext(ImageContext);
  const handleDeleteImage = (image) => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    fetch(`/https://hollywood-fairmount-admin.onrender.com/images/${image}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result.status === 200) {
          setImages(
            images.filter((image) => image._id !== selectedImageToDelete)
          );
          setConfirmDelete(false);
          setNotification("Image deleted successfully");
        }
      })
      .catch(() => setNotification("Something went wrong"));
  };
  return (
    <Wrapper>
      <Question>Are you sure?</Question>
      <ButtonWrapper>
        <Button key={"no"} name="no" onClick={() => setConfirmDelete(false)}>
          No
        </Button>
        <Button
          key={"yes"}
          name="yes"
          onClick={() => handleDeleteImage(selectedImageToDelete)}
        >
          Yes
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 100%;
  position: absolute;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Question = styled.p`
  font-size: 1.2rem;
  background-color: black;
  color: whitesmoke;
  padding: 5px 10px 5px 10px;
  border-radius: 0.5rem;
  &:hover {
    cursor: default;
  }
`;
const Button = styled.button`
  width: 30%;
  margin: 10px;
  padding: 10px 0 10px 0;
  border-radius: 0.5rem;
  border: none;
  background-color: ${(props) =>
    props.name === "yes" ? "#035e3f" : "#c02a2a"};
  font-weight: bold;
  color: white;
  transition: all 0.1s ease-in-out;
  &:hover {
    cursor: pointer;
    transform: scale(1.05);
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-direction: row;
`;
export default ConfirmDelete;
