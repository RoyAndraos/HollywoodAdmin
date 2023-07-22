import React from "react";
import styled, { css } from "styled-components";

const MyDayEvent = ({ event }) => {
  const isRalf = event.title === "Ralf";
  return <Wrapper isRalf={isRalf}>{event.title}</Wrapper>;
};

const Wrapper = styled.div`
  background-color: ${(props) => (props.isRalf ? "black" : "white")};
  color: ${(props) => (props.isRalf ? "white" : "black")};
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: ${(props) => (props.isRalf ? "50%" : "0")};
  transform: translateY(-50%);
  width: 50%;

  ${(props) =>
    !props.isRalf &&
    css`
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    `}
`;

export default MyDayEvent;
