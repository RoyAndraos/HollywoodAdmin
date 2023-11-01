import { styled } from "styled-components";
import { NavLink } from "react-router-dom";
import NotifLogs from "./NotifLogs";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    const token = Cookies.get("token");
    fetch("/logout", {
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
      <StyledNavLink to="/websiteTools">Tools</StyledNavLink>
      <Logout
        onClick={() => {
          handleLogout();
        }}
      >
        Logout
      </Logout>
      <NotifLogs />
    </Wrapper>
  );
};
const Logout = styled.button`
  margin-top: 20px;
  margin-bottom: 20px;
  text-decoration: none;
  font-size: inherit;
  font-weight: inherit;
  background-color: transparent;
  border: none;
  color: #efefef;
  padding: 10px 15px 10px 15px;
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
  font-size: 20px;
  font-weight: 600;
  background-color: #035e3f;
  box-shadow: 0 0 10px black;
  border-top-right-radius: 10px;
  width: 100%;
  z-index: 1000;
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
    outline: none;
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
