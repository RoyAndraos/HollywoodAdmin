import React from "react";
import { styled } from "styled-components";
import ImageInput from "./SlideshowInput";

const AboutImage = () => {
  return (
    <Wrapper>
      <h1>About Image</h1>
      <PreviewWrapper key={"about"}>
        <label>Preview</label>
        {/* <img src={images["about"].src} alt={images["about"].name} /> */}
      </PreviewWrapper>
      <label>Replace About Image</label>
      <ImageInput fileName={"about"} />
    </Wrapper>
  );
};
const Wrapper = styled.div`
  width: 100%;
  border: 1px solid black;
`;
const PreviewWrapper = styled.div``;

export default AboutImage;
