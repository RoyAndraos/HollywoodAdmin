import React, { useContext, useState, useEffect } from "react";
import ImageInput from "./SlideshowInput";
import { Title } from "./SlideShowImages";
import { ImageContext } from "../../contexts/ImageContext";
import { Wrapper, PreviewWrapper } from "./AboutImage";
import { ImageMenu } from "./MenuImg";
import Loader from "../../Loader";
const AboutPCBackground = () => {
  const { images } = useContext(ImageContext);
  const [aboutBackground, setAboutBackground] = useState([]);
  useEffect(() => {
    const updatedAboutImage = images.filter(
      (image) => image.filename === "aboutBackground"
    );
    setAboutBackground(updatedAboutImage);
  }, [images]);
  if (aboutBackground.length === 0) return <Loader />;
  return (
    <Wrapper>
      <Title>About Background Image</Title>
      <PreviewWrapper key={"aboutBackground"}>
        {aboutBackground.length !== 0 && (
          <ImageMenu
            src={aboutBackground[0].src}
            alt={"about section background image"}
          />
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
        Replace About Background Image
      </Title>
      <ImageInput filename={"aboutBackground"} />
    </Wrapper>
  );
};

export default AboutPCBackground;
