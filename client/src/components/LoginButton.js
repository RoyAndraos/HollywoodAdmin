import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components"
const LoginButton = () => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();

  const handleSignup = async () => {
    if (isAuthenticated && user) {
      try {
        const response = await fetch("/adminSignUp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ info: user }),
        });

        if (response.ok) {
          // User is granted access
          loginWithRedirect({
            redirectUri: `${window.location.origin}/dashboard/schedule`,
          });
        } else {
          // User is not granted access
          // Redirect to a page informing the user that access is denied
          loginWithRedirect({
            redirectUri: `${window.location.origin}/access-denied`,
          });
        }
      } catch (error) {
        // Handle error
        console.error("Error during signup:", error);
      }
    }
    // else {
    //   loginWithRedirect({
    //     redirectUri: `${window.location.origin}/dashboard/schedule`,
    //   });
    // }
  };
  const handleSignIn = () => {
    loginWithRedirect({
      redirectUri: `${window.location.origin}/dashboard/check`,
    });
  };
  return (
        <Wrapper>
          <StyledLogin onClick={() => handleSignIn()}>Sign In/Up</StyledLogin>
        </Wrapper>
  )
};

const StyledLogin = styled.button`
  background-color: transparent;
  border:none;
  width: 100%;
  padding: 10px 0 10px 0;
  border-radius: 10px;
  font-size:25px;
  &:hover{
    cursor:pointer
  }  
`
const Wrapper = styled.div`
  width: 20vw; 
  position :relative;
  left: 50%;
  transform: translateX(-50%);
`
export default LoginButton;
