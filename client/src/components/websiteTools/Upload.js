import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [file, setFile] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const navigate = useNavigate();
  const handleNavToShowImages = (e) => {
    e.preventDefault();
    navigate("/websiteTools/seeImages");
  };
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
    console.log(base64EncodedImage);
    try {
      await fetch("/upload", {
        method: "POST",
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <button onClick={(e) => handleNavToShowImages(e)}>See Images</button>
      <form onSubmit={(e) => handleSubmitFile(e)}>
        <StyledInput
          type="file"
          name="image"
          onChange={handleFileInputChange}
          value={file}
        />
        <StyledButton type="submit">Submit</StyledButton>
      </form>
      {previewSource && (
        <img src={previewSource} alt="chosen" style={{ height: "300px" }} />
      )}
    </div>
  );
};
const StyledInput = styled.input``;
const StyledButton = styled.button``;
export default Upload;
