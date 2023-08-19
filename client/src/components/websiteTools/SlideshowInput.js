import React, { useContext } from "react";
import { useState } from "react";
import styled from "styled-components";
import { ImageContext } from "../contexts/ImageContext";
const ImageInput = ({ filename }) => {
  const { setImages } = useContext(ImageContext);
  console.log(filename);
  const [previewSource, setPreviewSource] = useState("");
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };
  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!previewSource) return;
    uploadImage(previewSource);
  };
  const uploadImage = async (base64EncodedImage) => {
    try {
      await fetch("/upload", {
        method: "POST",
        body: JSON.stringify({ filename: filename, src: base64EncodedImage }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((result) => {
          setImages((prev) => [...prev, result.imageInfo]);
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Wrapper>
      <div>
        <StyledInput
          type="file"
          name="image"
          key="slideshow"
          onChange={(e) => handleFileInputChange(e)}
        />
        <StyledButton onClick={(e) => handleSubmitFile(e)}>Submit</StyledButton>
      </div>
      {previewSource && (
        <img src={previewSource} alt="chosen" style={{ height: "300px" }} />
      )}
    </Wrapper>
  );
};

const StyledInput = styled.input``;
const StyledButton = styled.button``;
const Wrapper = styled.div`
  border: 1px solid black;
`;

export default ImageInput;
