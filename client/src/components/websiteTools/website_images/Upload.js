import SlideShowImages from "./SlideShowImages";
import AboutImage from "./AboutImage";
import { styled } from "styled-components";
import AboutPCBackground from "./AboutPCBackground";
import MenuPcBackground from "./MenuPcBackground";
import BarbersPCBackground from "./BarbersPCBackground";
import HomepageBackground from "./HomepageBackground";

const Upload = () => {
  return (
    <Container>
      <SlideShowImages />
      <AboutImage />
      <AboutPCBackground />
      <MenuPcBackground />
      <BarbersPCBackground />
      <HomepageBackground />
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
