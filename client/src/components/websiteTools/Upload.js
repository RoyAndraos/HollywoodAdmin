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
  width: 70%;
  border: 1px solid red;
  left: 10vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
export default Upload;
