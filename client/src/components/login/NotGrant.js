import React from "react";
import { styled } from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { FiAlertTriangle } from "react-icons/fi";
const NotGrant = () => {
  const { logout } = useAuth0();
  const handleGoBackToHomePage = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };
  return (
    <Wrapper>
      <StyledFiAlertTriangle />
      <span>Access Not Granted</span>
      <GoBack
        onClick={() => {
          handleGoBackToHomePage();
        }}
      >
        Go back to Login here...
      </GoBack>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 50px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;
const GoBack = styled.button`
  border: none;
  background-color: transparent;
  font-family: inherit;
  font-size: 25px;
  text-decoration: underline;
  z-index: 100;
  &:hover {
    cursor: pointer;
  }
`;
const StyledFiAlertTriangle = styled(FiAlertTriangle)`
  position: fixed;
  font-size: 900px;
  transform: translateX(-24%) translateY(-50%);
  opacity: 0.2;
`;
export default NotGrant;
