import { useContext, useState, useEffect } from "react";
import { ImageContext } from "../contexts/ImageContext";
import ImageInput from "./SlideshowInput";
import { Title } from "./SlideShowImages";
import { Wrapper, PreviewWrapper } from "./AboutImage";
import { styled } from "styled-components";
const MenuImg = () => {
  const { images } = useContext(ImageContext);
  const [menuImg, setMenuImage] = useState([]);
  useEffect(() => {
    const updatedMenuImage = images.filter(
      (image) => image.filename === "menu"
    );
    setMenuImage(updatedMenuImage);
  }, [images]);

  return (
    <Wrapper>
      <Title>Menu Image</Title>
      <PreviewWrapper key={"menu"}>
        {menuImg.length !== 0 && (
          <ImageMenu src={menuImg[0].src} alt={"menu"} />
        )}
      </PreviewWrapper>
      <Title
        style={{
          borderBottom: "none",
          textDecoration: "underline",
          fontStyle: "normal",
        }}
      >
        Replace Menu Image
      </Title>
      <ImageInput filename={"menu"} />
    </Wrapper>
  );
};
const ImageMenu = styled.img`
  height: 500px;
`;
export default MenuImg;
