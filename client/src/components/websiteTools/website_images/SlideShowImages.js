import { useContext, useState } from "react";
import { ImageContext } from "../../contexts/ImageContext";
import { styled } from "styled-components";
import ConfirmDelete from "./ConfirmDelete";
import ImageInput from "./SlideshowInput";
const SlideShowImages = () => {
  const { images } = useContext(ImageContext);
  const [showDeleteConfirmations, setShowDeleteConfirmations] = useState(
    images.map(() => false)
  );
  const [selectedImageToDelete, setSelectedImageToDelete] = useState("");

  const handleDeletePress = (image, index) => {
    const newShowDeleteConfirmations = [...showDeleteConfirmations];
    newShowDeleteConfirmations[index] = true;
    setShowDeleteConfirmations(newShowDeleteConfirmations);
    setSelectedImageToDelete(image);
  };
  return (
    <Container key={"slideshow"}>
      <Title>Slideshow Images</Title>
      <PreviewWrapper key={"slideshow"}>
        {images.length !== 0 &&
          images.map((image, index) => {
            if (image.filename === "slideShow") {
              return (
                <ImageWrapper key={image._id}>
                  <StyledImage src={image.src} alt={image._id} />
                  <DeleteButton
                    key={image._id}
                    onClick={() => handleDeletePress(image._id, index)}
                  >
                    X
                  </DeleteButton>
                  {showDeleteConfirmations[index] && (
                    <ConfirmDelete
                      key={image._id + "confirm"}
                      setConfirmDelete={(value) => {
                        const newShowDeleteConfirmations = [
                          ...showDeleteConfirmations,
                        ];
                        newShowDeleteConfirmations[index] = value;
                        setShowDeleteConfirmations(newShowDeleteConfirmations);
                      }}
                      selectedImageToDelete={selectedImageToDelete}
                    />
                  )}
                </ImageWrapper>
              );
            } else {
              return null;
            }
          })}
      </PreviewWrapper>
      <InputWrapper>
        <Title
          key={"add image"}
          style={{
            borderBottom: "none",
            textDecoration: "underline",
            fontStyle: "normal",
            textAlign: "center",
          }}
        >
          Add Image
        </Title>
        <ImageInput filename={"slideShow"} key={"slideshowInput"} />
      </InputWrapper>
    </Container>
  );
};

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  width: 100%;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  color: #035e3f;
  letter-spacing: 0.2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #035e3f;
`;
const Container = styled.div`
  width: 100%;
  height: fit-content;
  padding-bottom: 2rem;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
`;
const PreviewWrapper = styled.div`
  height: 45%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const StyledImage = styled.img`
  width: 100%;
`;
const ImageWrapper = styled.div`
  position: relative;
  width: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 1rem 0 1rem;
`;
const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(192, 42, 42, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.5);
  padding: 2px 5px;
  color: white;
  font-size: 0.8rem;
  border-radius: 50%;
  text-align: center;
  transition: 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    background-color: rgba(192, 42, 42, 1);
  }
  &:active {
    transform: scale(0.98);
  }
`;
const InputWrapper = styled.div`
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export default SlideShowImages;
