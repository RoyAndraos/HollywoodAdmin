import React, { useContext } from "react";
import { ImageContext } from "../contexts/ImageContext.js";
import { styled } from "styled-components";
const ConfirmDelete = ({ setConfirmDelete, selectedImageToDelete }) => {
  const { images, setImages } = useContext(ImageContext);
  const handleDeleteImage = (image) => {
    fetch(`/images/${image}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setImages(
          images.filter((image) => image._id !== selectedImageToDelete)
        );
        setConfirmDelete(false);
      })
      .catch((err) => console.log(err));
  };
  return (
    <Wrapper>
      <Question>Are you sure?</Question>
      <ButtonWrapper>
        <Button key={"no"} name="no" onClick={() => setConfirmDelete(false)}>
          Nope!
        </Button>
        <Button
          key={"yes"}
          name="yes"
          onClick={() => handleDeleteImage(selectedImageToDelete)}
        >
          Yes, delete.
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
  font-size: 2rem;
  background-color: #f0f0f0;
  padding: 5px 10px 5px 10px;
  border-radius: 0.5rem;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.5);
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
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.5);
  background-color: ${(props) =>
    props.name === "yes" ? "limegreen" : "#c02a2a"};
  font-weight: bold;
  color: white;
  text-shadow: 7px 7px 7px black;
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
