import SlideShowImages from "./SlideShowImages";
import AboutImage from "./AboutImage";
import { styled } from "styled-components";
const Upload = () => {
  return (
    <Container>
      <SlideShowImages />
      <AboutImage />
    </Container>
  );
};
const Container = styled.div`
  font-family: sans-serif;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;
export default Upload;
