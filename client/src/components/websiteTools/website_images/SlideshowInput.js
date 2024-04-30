import React, { useContext, useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { ImageContext } from "../../contexts/ImageContext";
import { NotificationContext } from "../../contexts/NotficationContext";
import Cookies from "js-cookie";
import { UserContext } from "../../contexts/UserContext";
const ImageInput = ({ filename, height, initialImage }) => {
  const { images, setImages } = useContext(ImageContext);
  const { setNotification } = useContext(NotificationContext);
  const [previewSource, setPreviewSource] = useState("");
  const [imageHeight, setImageHeight] = useState("");
  const { setUserInfo } = useContext(UserContext);
  useEffect(() => {
    if (height) {
      setImageHeight(height);
    }
    if (initialImage) {
      setPreviewSource(initialImage);
    }
  }, [height, initialImage]);
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
      const token = Cookies.get("token");
      const headers = {
        authorization: token,
      };
      await fetch("https://hollywood-fairmount-admin.onrender.com/upload", {
        method: "PATCH",
        body: JSON.stringify({ filename: filename, src: base64EncodedImage }),
        headers: { "Content-Type": "application/json", ...headers },
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.imageInfo.filename === "slideShow") {
            setImages((prev) => [...prev, result.imageInfo]);
          } else if (result.imageInfo.filename === "about") {
            const removedAbout = images.filter(
              (image) => image.filename !== "about"
            );
            setImages([...removedAbout, result.imageInfo]);
          } else {
            // barberToEdit.image = result.imageInfo.src;
            setUserInfo((prevUserInfo) => {
              return prevUserInfo.map((user) => {
                if (user._id === result.imageInfo.filename) {
                  return { ...user, image: result.imageInfo.src };
                }
                return user;
              });
            });
          }
          setNotification("Image uploaded successfully");
        });
    } catch (err) {
      setNotification("Something went wrong");
    }
  };
  return (
    <Wrapper>
      <div>
        <StyledChooseFile>
          Choose File
          <StyledInput
            type="file"
            name="image"
            key="slideshow"
            onChange={(e) => handleFileInputChange(e)}
          />
        </StyledChooseFile>
        <StyledButton key={"submit"} onClick={(e) => handleSubmitFile(e)}>
          Submit
        </StyledButton>
      </div>
      {previewSource && (
        <StyledChosenImage
          src={previewSource}
          alt="chosen picture"
          imageheight={imageHeight}
        />
      )}
    </Wrapper>
  );
};

const StyledInput = styled.input`
  display: none;
`;
const StyledChooseFile = styled.label`
  background-color: #035e3f;
  color: whitesmoke;
  font-family: "Roboto", sans-serif;
  font-size: 1.2rem;
  padding: 5px 10px 5px 10px;
  border: none;
  outline: none;
  border-radius: 5px;
  transition: 0.3s ease-in-out;
  width: 100px;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &:active {
    transform: scale(0.98);
  }
`;
const StyledButton = styled.button`
  background-color: #035e3f;
  color: whitesmoke;
  font-family: "Roboto", sans-serif;
  font-size: 1.2rem;
  padding: 5px 10px 5px 10px;
  border: none;
  outline: none;
  border-radius: 5px;
  height: 35px;
  margin-left: 20px;
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &:active {
    transform: scale(0.98);
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
`;
const StyledChosenImage = styled.img`
  height: ${(props) => (props.imageheight === "200px" ? "200px" : "300px")};
  width: auto;
  margin-top: 20px;
  box-shadow: ${(props) =>
    props.imageheight === "200px" ? "0 0 10px black" : ""};
`;
export default ImageInput;
