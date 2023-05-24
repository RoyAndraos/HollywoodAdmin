import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components"
const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Wrapper>
      <StyledLogout
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      >
        Logout
      </StyledLogout>
    </Wrapper>
  );
};


const StyledLogout = styled.button`
  margin-top: 20px;
  margin-bottom: 20px;
  text-decoration: none;
  color: #efefef;
  padding: 10px 15px 10px 15px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  background-color:transparent;
  border:none;
  font-family: 'Brandon Grotesque black',serif;
  font-size: 20px;
  font-weight:600;
  &:hover{
    cursor:pointer;
  }
`
const Wrapper = styled.div`

`

export default LogoutButton;
