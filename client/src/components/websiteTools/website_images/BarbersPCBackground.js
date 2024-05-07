import React, { useContext, useState, useEffect } from "react";
import ImageInput from "./SlideshowInput";
import { Title } from "./SlideShowImages";
import { ImageContext } from "../../contexts/ImageContext";
import { Wrapper, PreviewWrapper } from "./AboutImage";
import { ImageMenu } from "./MenuImg";
import Loader from "../../Loader";
const BarbersPCBackground = () => {
  const { images } = useContext(ImageContext);
  const [barbersImage, setBarbersImage] = useState([]);
  useEffect(() => {
    const updatedAboutImage = images.filter(
      (image) => image.filename === "barbersBackground"
    );
    setBarbersImage(updatedAboutImage);
  }, [images]);

  if (barbersImage.length === 0) return <Loader />;
  return (
    <Wrapper>
      <Title>Barbers Background Image</Title>
      <PreviewWrapper key={"barbersBackground"}>
        {barbersImage.length !== 0 && (
          <ImageMenu
            src={barbersImage[0].src}
            alt={"barbers section background image"}
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
        Replace Barbers Image
      </Title>
      <ImageInput filename={"barbersBackground"} />
    </Wrapper>
  );
};

export default BarbersPCBackground;
