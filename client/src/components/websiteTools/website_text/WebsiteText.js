import React from "react";
import { styled } from "styled-components";
import AboutText from "./AboutText";
import UnderMenuText from "./UnderMenuText";
const WebsiteText = () => {
  return (
    <Wrapper>
      <UnderMenuText />
      <AboutText />
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
