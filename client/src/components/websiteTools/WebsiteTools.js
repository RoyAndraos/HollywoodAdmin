import React, { useState } from "react";
import Upload from "./Upload";
import BarberProfiles from "./BarberProfiles";
import ToolBar from "./ToolBar";
import styled from "styled-components";
import WebsiteText from "./WebsiteText";
import Clients from "./Clients";
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
          {selectedOption === "clients" && <Clients />}
        </RestWrapper>
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  width: 95vw;
  position: relative;
`;

const RestWrapper = styled.div`
  width: 80%;
  position: absolute;

  right: -2%;
`;

export default WebsiteTools;
