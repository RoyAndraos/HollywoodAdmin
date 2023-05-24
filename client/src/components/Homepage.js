import { styled } from "styled-components";
import LoginButton from "./LoginButton";


const Homepage = () => {
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
  width:fit-content;
  transform: translateX(-50%) translateY(-50%);
`

export default Homepage;
