import { useEffect, useState } from "react";
import styled from "styled-components";
import back from "./components/assets/back.png";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [isUsernameFocused, setUsernameFocused] = useState("false");
  const [isPasswordFocused, setPasswordFocused] = useState("false");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      return;
    } else {
      navigate("/schedule");
    }
  }, [navigate]);
  const handleUsernameFocus = () => {
    setUsernameFocused("true");
  };
  const handlePasswordFocus = () => {
    setPasswordFocused("true");
  };
  const handleSubmit = () => {
    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          Cookies.set("token", data.token, { expires: 1 / 13 });
          navigate("/schedule");
        } else {
          alert("Incorrect username or password");
        }
      });
  };

  return (
    <Wrapper>
      <StyledBackground src={back} alt="dark green" />
      <LoginWrapper>
        <LabelInputWrapper>
          <StyledLabel props={isUsernameFocused}>Username</StyledLabel>
          <StyledInput
            onClick={() => {
              handleUsernameFocus();
            }}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </LabelInputWrapper>
        <LabelInputWrapper>
          <StyledLabel
            props={isPasswordFocused}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          >
            Password
          </StyledLabel>
          <StyledInput
            onClick={() => {
              handlePasswordFocus();
            }}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
          />
        </LabelInputWrapper>
        <Submit
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
        </Submit>
      </LoginWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledBackground = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 33%;
  height: 70%;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 20px;
  z-index: 1;
`;

const StyledInput = styled.input`
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid grey;
  border-radius: 15px;
  width: 60%;
  height: 50%;
  font-size: 1.2rem;
  caret-color: transparent;
  padding-left: 30px;
  &:hover {
    outline: 2px solid #035e3f;
    cursor: pointer;
  }
  &:focus {
    outline: 2px solid #035e3f;
  }
`;

const StyledLabel = styled.label`
  position: absolute;
  font-size: ${(props) => {
    return props.props === "true" ? "2rem" : "1.2rem";
  }};
  top: ${(props) => {
    return props.props === "true" ? "-15%" : "24%";
  }};
  color: ${(props) => {
    return props.props === "true" ? "#068d5f" : "rgba(0,0,0,0.9)";
  }};
  left: 23%;
  transition: all 0.2s;
`;

const LabelInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 20%;
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Submit = styled.button`
  font-size: 1.2rem;
  width: 20%;
  height: 8%;
  background-color: #e7e7e7;
  border: 2px solid transparent;
  border-bottom: 5px solid #035e3f;
  border-radius: 10px;
  transition: all 0.3s ease-out;
  cursor: pointer;
  &:hover {
    transition: 0.5s ease-in-out;
    background-color: #035e3f;
    color: whitesmoke;
    border-bottom: 5px solid #e7e7e7;
  }
  &:active {
    transform: scale(0.94);
    transition: 0.1s ease-in-out;
  }
`;

export default Login;
