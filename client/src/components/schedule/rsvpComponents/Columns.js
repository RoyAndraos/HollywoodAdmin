import React from "react";
import styled from "styled-components";
const Columns = () => {
  return (
    <>
      <Ralf>Ralf</Ralf>
      <Line></Line>
      <Alain>Alain</Alain>
    </>
  );
};
const Line = styled.div`
  height: 80.5vh;
  top: 60px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  position: absolute;
  left: 50%;
  z-index: 1;
`;
const Ralf = styled.div`
  position: absolute;
  top: 7vh;
  font-size: 25px;
  left: 26vw;
  z-index: 2;
`;
const Alain = styled.div`
  position: absolute;
  top: 7vh;
  font-size: 25px;
  left: 68vw;
  z-index: 2;
`;
export default Columns;
