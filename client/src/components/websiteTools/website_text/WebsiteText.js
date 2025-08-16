import { styled } from "styled-components";
import AboutText from "./AboutText";
import UnderMenuText from "./UnderMenuText";
const WebsiteText = ({ text, setText }) => {
  return (
    <Wrapper>
      <UnderMenuText text={text} setText={(text, setText)} />
      <AboutText text={text} setText={(text, setText)} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  justify-content: space-evenly;
  align-items: center;
`;
export default WebsiteText;
