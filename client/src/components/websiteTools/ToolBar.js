import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { LoginRoleContext } from "../contexts/LoginRoleContext";
const ToolBar = ({ selectedOption, setSelectedOption }) => {
  const [isScrolled, setIsScrolled] = useState("false");
  const { role } = useContext(LoginRoleContext);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled("true");
      } else {
        setIsScrolled("false");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Wrapper isscrolled={isScrolled}>
      <StyledNavButton
        key={"barberProfiles"}
        onClick={() => setSelectedOption("barberProfiles")}
        isselected={selectedOption === "barberProfiles" ? "true" : "false"}
      >
        Barber Profiles
      </StyledNavButton>
      {role === "admin" && (
        <StyledNavButton
          key={"websiteText"}
          onClick={() => setSelectedOption("websiteText")}
          isselected={selectedOption === "websiteText" ? "true" : "false"}
        >
          Website Text
        </StyledNavButton>
      )}
      {role === "admin" && (
        <StyledNavButton
          key={"images"}
          onClick={() => setSelectedOption("images")}
          isselected={selectedOption === "images" ? "true" : "false"}
        >
          Images
        </StyledNavButton>
      )}
      {role === "admin" && (
        <StyledNavButton
          key={"Clients"}
          onClick={() => setSelectedOption("clients")}
          isselected={selectedOption === "clients" ? "true" : "false"}
        >
          Clients
        </StyledNavButton>
      )}
      <StyledNavButton
        key={"services"}
        onClick={() => setSelectedOption("services")}
        isselected={selectedOption === "services" ? "true" : "false"}
      >
        Services
      </StyledNavButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: ${(props) => (props.isscrolled === "true" ? "100vh" : "90vh")};
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  border: none;
  top: ${(props) => (props.isscrolled === "true" ? "0" : "9vh")};
  transition: 0.3s ease-in-out;
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
