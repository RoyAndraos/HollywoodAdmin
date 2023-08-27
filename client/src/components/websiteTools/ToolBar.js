import React from "react";
import styled from "styled-components";
const ToolBar = ({ selectedOption, setSelectedOption }) => {
  return (
    <Wrapper>
      <StyledNavButton
        key={"barberProfiles"}
        onClick={() => setSelectedOption("barberProfiles")}
        isselected={selectedOption === "barberProfiles" ? "true" : "false"}
      >
        Barber Profiles
      </StyledNavButton>
      <StyledNavButton
        key={"websiteText"}
        onClick={() => setSelectedOption("websiteText")}
        isselected={selectedOption === "websiteText" ? "true" : "false"}
      >
        Website Text
      </StyledNavButton>
      <StyledNavButton
        key={"images"}
        onClick={() => setSelectedOption("images")}
        isselected={selectedOption === "images" ? "true" : "false"}
      >
        Images
      </StyledNavButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 90vh;
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  top: 9vh;
`;
const StyledNavButton = styled.button`
  background-color: ${(props) =>
    props.isselected === "true" ? "#035e3f" : "#011c13"};
  transform: ${(props) =>
    props.isselected === "true" ? "scale(0.98) translateX(-1%)" : "scale(1)"};
  box-shadow: 0 0 10px black;
  transition: all 0.3s ease-in-out;
  color: whitesmoke;
  outline: none;
  border: none;
  font-family: "Roboto", sans-serif;
  font-size: 1.2rem;
  width: 100%;
  padding: 1rem;
  height: 100%;
  &:hover {
    background-color: #035e3f;
    cursor: pointer;
  }
`;
export default ToolBar;