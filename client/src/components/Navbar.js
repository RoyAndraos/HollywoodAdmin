import React from "react";
import { styled } from "styled-components";
import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const NavBar = () => {
  return (
    <Wrapper>
      <StyledNavLink to="/dashboard/schedule">Schedule</StyledNavLink>
      <StyledNavLink to="/dashboard/services">Services</StyledNavLink>
      <StyledNavLink to="/dashboard/data">Business Data</StyledNavLink>
      <LogoutButton/>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  font-size: 20px;
  font-weight: 600;
  background-color: #2c3e50;
  border-radius: 20px;
  margin-top: 20px;
  margin-right: 20px;
  margin-left: 20px;
`;

const StyledNavLink = styled(NavLink)`
  margin-top: 20px;
  margin-bottom: 20px;
  text-decoration: none;
  color: #efefef;
  padding: 10px 15px 10px 15px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  &.active {
    text-decoration: underline;
    background-color: #efefef;
    color: #2c3e50;
  }
`;
export default NavBar;

// {
//   "given_name":"Roy",
//   "family_name":"andraos",
//   "nickname":"Roy_andraos",
//   "name":"Roy andraos",
//   "picture":"https://lh3.googleusercontent.com/a/AGNmyxZ42A67uSF3cQwZmkh3Ja5Nnjxonx7Q5HL2FYI9=s96-c",
//   "locale":"en","updated_at":"2023-05-23T23:28:46.291Z",
//   "email":"Roy_andraos@live.fr",
//   "email_verified":true,
//   "sub":"google-oauth2|105225886944241955254"
// }
