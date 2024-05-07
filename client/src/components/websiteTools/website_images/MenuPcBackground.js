import React, { useContext, useState, useEffect } from "react";
import ImageInput from "./SlideshowInput";
import { Title } from "./SlideShowImages";
import { ImageContext } from "../../contexts/ImageContext";
import { Wrapper, PreviewWrapper } from "./AboutImage";
import { ImageMenu } from "./MenuImg";
import Loader from "../../Loader";
const MenuPcBackground = () => {
  const { images } = useContext(ImageContext);
  const [menuImg, setMenuImg] = useState([]);
  useEffect(() => {
    const updatedAboutImage = images.filter(
      (image) => image.filename === "menuBackground"
    );
    setMenuImg(updatedAboutImage);
  }, [images]);
  if (menuImg.length === 0) return <Loader />;
  return (
    <Wrapper>
      <Title>Menu Background Image</Title>
      <PreviewWrapper key={"menuBackgroundImage"}>
        {menuImg.length !== 0 && (
          <ImageMenu
            src={menuImg[0].src}
            alt={"menu section background image"}
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
        Replace Menu Image
      </Title>
      <ImageInput filename={"menuBackground"} />
    </Wrapper>
  );
};

export default MenuPcBackground;
