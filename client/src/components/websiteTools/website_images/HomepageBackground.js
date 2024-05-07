import React, { useContext, useState, useEffect } from "react";
import ImageInput from "./SlideshowInput";
import { Title } from "./SlideShowImages";
import { ImageContext } from "../../contexts/ImageContext";
import { Wrapper, PreviewWrapper } from "./AboutImage";
import { ImageMenu } from "./MenuImg";
import Loader from "../../Loader";
const HomepageBackground = () => {
  const { images } = useContext(ImageContext);
  const [homepage, setHomePage] = useState([]);
  useEffect(() => {
    const updatedAboutImage = images.filter(
      (image) => image.filename === "homepageBackground"
    );
    setHomePage(updatedAboutImage);
  }, [images]);
  if (homepage.length === 0) return <Loader />;
  return (
    <Wrapper>
      <Title>Homepage Background Image</Title>
      <PreviewWrapper key={"homepageBackground"}>
        {homepage.length !== 0 && (
          <ImageMenu
            src={homepage[0].src}
            alt={"homepage section background image"}
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
        Replace Homepage Image
      </Title>
      <ImageInput filename={"homepageBackground"} />
    </Wrapper>
  );
};

export default HomepageBackground;
