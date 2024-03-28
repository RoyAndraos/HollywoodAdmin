import React from "react";
import styled from "styled-components";
import Loader from "../Loader";
const DailyAvailability = ({ selectedDailyCells, setSelectedDailyCells }) => {
  if (!selectedDailyCells) return Loader;
  return (
    <SlotWrapper>
      {selectedDailyCells.map((cell, index) => {
        return (
          <div key={cell.slot}>
            <Slot
              $available={cell.available}
              onClick={() => {
                const newSelectedDailyCells = [...selectedDailyCells];
                newSelectedDailyCells[index].available =
                  !newSelectedDailyCells[index].available;
                setSelectedDailyCells(newSelectedDailyCells);
              }}
            >
              {cell.slot}
            </Slot>
          </div>
        );
      })}
    </SlotWrapper>
  );
};
const Slot = styled.div`
  border: 1px solid black;
  cursor: pointer;
  width: 15vw;
  height: 3vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 2px;
  color: ${(props) => (props.$available ? "black" : "white")};
  background-color: ${(props) => (props.$available ? "white" : "#033a27")};
  transition: 0.3s ease-in-out;
  font-family: "Roboto", sans-serif;
  &:hover {
    opacity: 0.8;
  }
  @media (max-width: 768px) {
    width: 25vw;
    padding: 5px 0;
    margin-bottom: 2px;
  }
`;

const SlotWrapper = styled.div`
  display: grid;
  grid-template-columns: 33% 33% 33%;
  width: 60%;
  position: relative;
  top: 10%;
  height: 60%;
  margin: 0 auto;
  @media (max-width: 768px) {
    place-content: center;
    width: 80vw;
  }
`;
export default DailyAvailability;
