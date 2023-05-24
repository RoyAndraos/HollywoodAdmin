import React, { useState } from "react";
import { styled } from "styled-components";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getDailyHours } from "./helpers";

const TimeSelect = () => {
  const [selectedCells, setSelectedCells] = useState([]);
  const navigate = useNavigate();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const daily = getDailyHours();
  const resetSchedule = () => {
    setSelectedCells([]);
  };
  const firstDaily = [
    "9 am - 10 am",
    "11 am - 12 pm",
    "1 pm - 2 pm",
    "3 pm - 4 pm",
    "5 pm - 6 pm",
    "8 pm - 9 pm",
  ];
  const handleExit = (e) => {
    e.preventDefault();
    navigate("/dashboard/schedule");
  };
  const handleCellClick = (dayIndex, timeIndex) => {
    const cellKey = `${dayIndex}-${timeIndex}`;
    const isSelected = selectedCells.includes(cellKey);
    if (isSelected) {
      setSelectedCells(selectedCells.filter((cell) => cell !== cellKey));
    } else {
      setSelectedCells([...selectedCells, cellKey]);
    }
  };

  return (
    <Wrapper>
      <BackButton onClick={(e) => handleExit(e)}>
        <FaArrowLeft />
      </BackButton>
      <button onClick={resetSchedule}>Reset</button>
      <TableWrapper>
        <FirstRow>
          {firstDaily.map((time, index) => (
            <FirstRowDay key={index}>{time}</FirstRowDay>
          ))}
        </FirstRow>

        <Table>
          <tbody>
            {days.map((day, dayIndex) => (
              <tr key={day}>
                <TH onClick={() => console.log(day)}>{day}</TH>
                {daily.map((_, timeIndex) => {
                  const cellKey = `${dayIndex}-${timeIndex}`;
                  const isSelected = selectedCells.includes(cellKey);
                  return (
                    <td
                      value={_}
                      key={cellKey}
                      onClick={() => handleCellClick(dayIndex, timeIndex)}
                      className={isSelected ? "selected" : ""}
                    ></td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 70%;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  height: 90%;
  width: 80%;
  border-radius: 30px;
`;

const BackButton = styled.button`
  margin-top: 50px;
  margin-left: 50px;
  border-radius: 30px;
  border: none;
  text-align: center;
  font-size: 40px;
  color: black;
  opacity: 0.5;
  background-color: transparent;
  width: 60px;
  height: 40px;
  position: absolute;
  transition: 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;

const Table = styled.table`
  position: relative;
  top: 10%;

  width: 100%;
  td {
    border: 1px solid black;
    padding: 8px;
    text-align: center;
    height: 40px;
    transition: 0.3s ease-in-out;
    &.selected {
      background-color: #00223b;
      color: white;
    }
    &:active {
      transform: scale(0.8);
    }
    &:hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.6);
    }
  }
`;

const TableWrapper = styled.div`
  width: 95%;
  height: 100%;
  overflow: auto;
  border-radius: 30px;
  border: none;
  margin-left: 2.5%;
`;

const TH = styled.th`
  background-color: #0099cc;
  border: 1px solid black;
  color: rgba(255, 255, 255, 0.9);
  font-family: "Times New Roman", Times, serif;
`;
const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 40px;
  position: relative;
  top: 10%;
  left: 7.75%;
  width: 92.2%;
`;
const FirstRowDay = styled.div`
  background-color: #0099cc;
  border: 1px solid black;
  width: 16.43%;
  justify-content: center;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  font-family: "Times New Roman", Times, serif;
`;
// Object.entries(e.target)[0][1].key
export default TimeSelect;
