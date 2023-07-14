import React, { useState, useContext, useEffect } from "react";
import { styled } from "styled-components";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getDailyHours } from "../helpers";
import { UserContext } from "../contexts/UserContext";
import { initialAvailability } from "../helpers";
const TimeSelect = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [selectedAdminInfo, setSelectedAdminInfo] = useState(userInfo[0]);
  const [showBarbers, setShowBarbers] = useState(false);
  const [selectedCells, setSelectedCells] = useState(initialAvailability);
  useEffect(() => {
    setSelectedCells(selectedAdminInfo.availability);
  }, [selectedAdminInfo]);
  const navigate = useNavigate();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const daily = getDailyHours();

  const selectBarber = (e, barber) => {
    e.preventDefault();
    setSelectedAdminInfo(barber);
    setShowBarbers(!showBarbers);
  };

  const saveChanges = () => {
    setSelectedAdminInfo({ ...selectedAdminInfo, availability: selectedCells });
    const adminToBeUpdated = userInfo.findIndex(
      (user) => user.given_name === selectedAdminInfo.given_name
    );
    const updatedUserInfo = [...userInfo];
    updatedUserInfo[adminToBeUpdated].availability = selectedCells;
    setUserInfo(updatedUserInfo);
    fetch("/updateAvailability", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: selectedAdminInfo._id,
        availability: selectedCells,
      }),
    });
    navigate("/dashboard/schedule");
  };
  const resetSchedule = () => {
    setSelectedCells(initialAvailability);
  };
  const firstDaily = [
    "9am",
    "10am",
    "11am",
    "12pm",
    "1pm",
    "2pm",
    "3pm",
    "4pm",
    "5pm",
    "6pm",
    "7pm",
  ];
  const handleExit = (e) => {
    e.preventDefault();
    navigate("/dashboard/schedule");
  };
  const handleCellClick = (dayIndex, timeIndex) => {
    const cellKey = `${dayIndex}-${timeIndex}`;
    const updatedCells = selectedCells.map((cell) => {
      if (cell.slot === cellKey) {
        console.log(cell);
        return {
          ...cell,
          available: !cell.available, // Toggle the availability
        };
      }
      return cell;
    });

    setSelectedCells(updatedCells);
  };

  const handleRowClick = (day) => {
    const rowCells = daily.map((_) => `${day}-${_}`);
    const areAllCellsSelected = rowCells.every((cellKey) =>
      selectedCells.some((cell) => cell.slot === cellKey && cell.available)
    );

    const updatedCells = selectedCells.map((cell) => {
      if (rowCells.includes(cell.slot)) {
        return {
          ...cell,
          available: areAllCellsSelected ? false : true,
        };
      }
      return cell;
    });

    setSelectedCells(updatedCells);
  };

  return (
    <Wrapper>
      <ButtonWrapper>
        <BackButton onClick={(e) => handleExit(e)}>
          <FaArrowLeft />
        </BackButton>
        <ControlPanel>
          <Reset onClick={resetSchedule}>Reset</Reset>
          <SaveChanges onClick={saveChanges}>Save Changes</SaveChanges>
          <AdminName onClick={() => setShowBarbers(!showBarbers)}>
            {selectedAdminInfo.given_name}
          </AdminName>
          {showBarbers ? (
            <BarberContainer>
              {userInfo.map((barber) => {
                return (
                  <BarberCard
                    key={barber.given_name}
                    onClick={(e) => selectBarber(e, barber)}
                  >
                    {barber.given_name}
                  </BarberCard>
                );
              })}
            </BarberContainer>
          ) : null}
        </ControlPanel>
      </ButtonWrapper>

      <TableWrapper>
        <FirstRow>
          {firstDaily.map((time, index) => (
            <FirstRowDay key={index}>{time}</FirstRowDay>
          ))}
        </FirstRow>

        <Table>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <TH onClick={() => handleRowClick(day)}>{day}</TH>
                {daily.map((_) => {
                  const cellKey = `${day}-${_}`;
                  const cell = selectedCells.find(
                    (cell) => cell.slot === cellKey
                  );
                  const isSelected = cell && cell.available;
                  return (
                    <td
                      value={_}
                      key={cellKey}
                      onClick={() => handleCellClick(day, _)}
                      className={isSelected ? "" : "selected"}
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
  width: 95vw;
  position: relative;
  display: flex;
  flex-direction: column;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  height: 90vh;
  border-radius: 30px;
`;

const ButtonWrapper = styled.div`
  margin-left: 50px;
  margin-right: 50px;
  position: relative;
  display: grid;
  grid-template-columns: 20% 80%;
  margin-top: 50px;
`;

const BackButton = styled.button`
  border-radius: 30px;
  border: none;
  text-align: center;
  font-size: 40px;
  color: black;
  opacity: 0.5;
  background-color: transparent;
  width: 60px;
  height: 40px;
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
      background-color: #033a27;
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
  width: 85vw;
  height: 100%;
  overflow: auto;
  border-radius: 30px;
  border: none;
  margin-left: 2.5%;
`;

const TH = styled.th`
  background-color: #035e3f;
  border: 1px solid black;
  color: rgba(255, 255, 255, 0.9);
  transition: 0.2s ease-in-out;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;

  &:hover {
    cursor: pointer;
    background-color: #e5e2e2;
    border: #035e3f solid 1px;
    color: #035e3f;
  }
`;
const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 40px;
  position: relative;
  top: 10%;
  left: 4.34%;
  max-width: 95.5%;
`;
const FirstRowDay = styled.div`
  background-color: #035e3f;
  border: 1px solid black;
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  margin-right: 0.2%;
  &:last-of-type {
    margin-right: 0;
  }
`;
const Reset = styled.button`
  margin-right: 2vw;
  min-width: 12vw;
  width: fit-content;
  padding: 10px 5px 10px 5px;
  border: 2px solid transparent;
  border-radius: 10px;
  transition: 0.2s ease-in-out;
  background-color: #035e3f;
  color: whitesmoke;
  font-size: 20px;
  &:hover {
    cursor: pointer;
    background-color: #e5e2e2;
    border: #035e3f solid 2px;
    color: #035e3f;
  }
`;
const SaveChanges = styled.button`
  margin-left: 2vw;
  min-width: 12vw;
  width: fit-content;
  padding: 10px 5px 10px 5px;
  border: 2px solid transparent;
  border-radius: 10px;
  transition: 0.2s ease-in-out;
  background-color: #035e3f;
  color: whitesmoke;
  font-size: 20px;
  &:hover {
    cursor: pointer;
    background-color: #e5e2e2;
    border: #035e3f solid 2px;
    color: #035e3f;
  }
`;
const ControlPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const AdminName = styled.div`
  border: 3px solid rgba(0, 0, 0, 0.3);
  border-top-right-radius: 30px;
  width: 70px;
  height: 50px;
  align-items: center;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  margin-left: 100px;
  font-size: 25px;
  font-family: "Roboto", sans-serif;
  transition: 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const BarberContainer = styled.div`
  position: absolute;
  right: 0;
  transform: translateX(150%);
  width: 100px;
`;

const BarberCard = styled.div`
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: center;
  margin: 5px 0 0 0;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  font-size: 20px;
  width: 200px;
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
  &:first-of-type {
    margin: 0;
  }
`;

export default TimeSelect;
