import { useContext, useState } from "react";
import { ImageContext } from "../contexts/ImageContext";
import { styled } from "styled-components";
import ConfirmDelete from "./ConfirmDelete";
import ImageInput from "./SlideshowInput";
const SlideShowImages = () => {
  const { images } = useContext(ImageContext);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedImageToDelete, setSelectedImageToDelete] = useState("");
  const handleDeletePress = (image) => {
    setConfirmDelete(!confirmDelete);
    setSelectedImageToDelete(image);
  };
  return (
    <Container>
      <h1>Slideshow Images</h1>
      <PreviewWrapper key={"slideshow"}>
        <label>Preview</label>
        {images !== [] &&
          images.map((image) => {
            if (image.filename === "slideShow") {
              console.log(image._id);
              return (
                <ImageWrapper key={image._id}>
                  <StyledImage src={image.src} alt={image._id} />
                  <DeleteButton onClick={() => handleDeletePress(image._id)}>
                    Delete
                  </DeleteButton>
                  {confirmDelete && (
                    <ConfirmDelete
                      setConfirmDelete={setConfirmDelete}
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
      <div>
        <label>Add Image</label>
        <ImageInput filename={"slideShow"} key={"slideshowInput"} />
      </div>
    </Container>
  );
};
const Container = styled.div`
  width: 100%;
  height: 80vh;
  margin-top: 2rem;
`;
const PreviewWrapper = styled.div`
  height: 20vh;
`;
const StyledImage = styled.img`
  width: 100%;
`;
const ImageWrapper = styled.div`
  position: relative;
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #c02a2a;
  border: 2px solid black;
  padding: 2px 15px;
  color: white;
  font-size: 0.8rem;
  border-radius: 0.5rem;
`;
export default SlideShowImages;
