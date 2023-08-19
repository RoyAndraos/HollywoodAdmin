import React, { useState } from "react";

import Upload from "./Upload";
import BarberProfiles from "./BarberProfiles";
import ToolBar from "./ToolBar";
import styled from "styled-components";
import WebsiteText from "./WebsiteText";
const WebsiteTools = () => {
  const [selectedOption, setSelectedOption] = useState("barberProfiles");
  return (
    <Wrapper>
      <ToolBar
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <div style={{ position: "relative" }}>
        <RestWrapper>
          {selectedOption === "websiteText" && <WebsiteText />}
          {selectedOption === "images" && <Upload />}
          {selectedOption === "barberProfiles" && <BarberProfiles />}
        </RestWrapper>
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  width: 100vw;
  position: relative;
`;

const RestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default WebsiteTools;
