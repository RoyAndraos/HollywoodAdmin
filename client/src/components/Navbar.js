import { styled } from "styled-components";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { IsMobileContext } from "./contexts/IsMobileContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { isMobile } = useContext(IsMobileContext);
  const role = Cookies.get("role");
  const handleLogout = () => {
    const token = Cookies.get("token");
    fetch("http://localhost:4000/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    });
    Cookies.remove("token");
    navigate("/");
  };

  return (
    <Wrapper>
      <StyledNavLink to="/schedule">Schedule</StyledNavLink>
      <StyledNavLink to="/availability">Availability</StyledNavLink>
      {!isMobile && role === "admin" && (
        <StyledNavLink to="/websiteTools">Tools</StyledNavLink>
      )}
      {/* {role === "admin" && !isMobile && (
        <StyledNavLink to="/Data">Data</StyledNavLink>
      )} */}
      <StyledNavLink to="/">
        <Logout
          onClick={() => {
            handleLogout();
          }}
        >
          Logout
        </Logout>
      </StyledNavLink>
    </Wrapper>
  );
};
const Logout = styled.button`
  text-decoration: none;
  font-size: inherit;
  font-weight: inherit;
  background-color: transparent;
  border: none;
  color: #efefef;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
`;
const Wrapper = styled.div`
  font-family: "Roboto", sans-serif;
  letter-spacing: 2px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  height: 9vh;
  background-color: #035e3f;
  box-shadow: 0 0 10px black;
  border-top-right-radius: 10px;
  width: 100%;
  z-index: 1000;
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: #efefef;
  padding: 10px 15px 10px 15px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  &.active {
    outline: none;
    text-decoration: underline;
    background-color: #efefef;
    color: #2c3e50;
  }
  @media (max-width: 768px) {
    padding: 5px 5px;
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
