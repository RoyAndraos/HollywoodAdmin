import React, { useContext, useState, useEffect } from "react";
import { styled } from "styled-components";
import ImageInput from "./SlideshowInput";
import { Title } from "./SlideShowImages";
import { ImageContext } from "../../contexts/ImageContext";
import { ImageMenu } from "./MenuImg";
const AboutImage = () => {
  const { images } = useContext(ImageContext);
  const [aboutImage, setAboutImage] = useState([]);
  useEffect(() => {
    const updatedAboutImage = images.filter(
      (image) => image.filename === "about"
    );
    setAboutImage(updatedAboutImage);
  }, [images]);
  if (aboutImage.length === 0) return <p>loading...</p>;
  else
    return (
      <Wrapper>
        <Title>About Image</Title>
        <PreviewWrapper key={"about"}>
          {aboutImage.length !== 0 && (
            <ImageMenu src={aboutImage[0].src} alt={"about"} />
          )}
        </PreviewWrapper>
        <Title
          style={{
            borderBottom: "none",
            textDecoration: "underline",
            fontStyle: "normal",
            textAlign: "center",
          }}
        >
          Replace About Image
        </Title>
        <ImageInput filename={"about"} />
      </Wrapper>
    );
};
export const Wrapper = styled.div`
  width: 100%;
  margin-top: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  padding-bottom: 2rem;
  border-radius: 0.5rem;
`;
export const PreviewWrapper = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
`;

export default AboutImage;
