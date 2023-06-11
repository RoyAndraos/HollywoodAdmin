import { styled } from "styled-components";
import LoginButton from "./LoginButton";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Homepage = () => {
  const { isAuthenticated, logout } = useAuth0();

  useEffect(() => {
    console.log(isAuthenticated);

    const handleBeforeUnload = () => {
      if (isAuthenticated) {
        console.log("Resetting cookies and clearing storage...");
        // Perform necessary actions to reset cookies and clear storage here
        logout({ returnTo: window.location.origin });
      }
    };

    const cleanupBeforeUnload = () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return cleanupBeforeUnload;
  }, [isAuthenticated, logout]);

  return (
    <Wrapper>
      <LoginButton />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 40%;
  left: 50%;
  width: fit-content;
  transform: translateX(-50%) translateY(-50%);
`;

export default Homepage;
