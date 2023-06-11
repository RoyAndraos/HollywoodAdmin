import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  const handleSignIn = () => {
    loginWithRedirect({
      redirectUri: `${window.location.origin}/dashboard/check`,
    });
  };
  return (
    <Wrapper>
      <StyledLogin onClick={() => handleSignIn()}>Sign In/Up</StyledLogin>
    </Wrapper>
  );
};

const StyledLogin = styled.button`
  background-color: transparent;
  border: none;
  width: 100%;
  padding: 10px 0 10px 0;
  border-radius: 10px;
  font-size: 25px;
  &:hover {
    cursor: pointer;
  }
`;
const Wrapper = styled.div`
  width: 20vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;
export default LoginButton;
