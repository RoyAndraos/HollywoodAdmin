import styled from "styled-components";

import TimeSelect from "./TimeSelect";
const AvailabilityComponent = () => {
  return (
    <Wrapper>
      <Container>
        <TimeSelect />
      </Container>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
`;
const Container = styled.div`
  position: fixed;
  height: 80vh;
  width: 100%;

  background-color: transparent;
  border-radius: 30px;
  top: 50vh;
  left: 50vw;
  transform: translateX(-50%) translateY(-50%);
`;

export default AvailabilityComponent;
