import React, { useState, useContext, useEffect } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { getDailyHours } from "../helpers";
import { UserContext } from "../contexts/UserContext";
import { initialAvailability } from "../helpers";
import { NotificationContext } from "../contexts/NotficationContext";
const TimeSelect = () => {
  // useContext/useState: user, notification selectedBarber, switch selectedBarber, selectedCells (slot cells that are selected)
  const { setUserInfo, userInfo } = useContext(UserContext);
  const { setNotification } = useContext(NotificationContext);
  const [selectedAdminInfo, setSelectedAdminInfo] = useState(userInfo[0]);
  const [showBarbers, setShowBarbers] = useState(false);
  const [selectedCells, setSelectedCells] = useState(initialAvailability);

  // useEffect: link the available cells to the selected barber's availability (set them) everytime the selected barber changes
  useEffect(() => {
    setSelectedCells(selectedAdminInfo.availability);
  }, [selectedAdminInfo]);
  const navigate = useNavigate();

  // day names for the table
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // daily hours for the table (from 9am to 8pm)
  const daily = getDailyHours();

  // function: select/change barber
  const selectBarber = (e, barber) => {
    e.preventDefault();
    setSelectedAdminInfo(barber);
    setShowBarbers(!showBarbers);
  };

  // function: save changes updates the availability of the selected barber in the database and the context
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
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setNotification("Availability updated successfully");
        }
        navigate("/dashboard/schedule");
      });
  };

  // function: reset schedule resets the availability of the selected barber to the initial state (open all slots)
  const resetSchedule = () => {
    setSelectedCells(initialAvailability);
  };

  // first row of the table (hours)
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

  // function: handleCellClick toggles the availability of the selected cell
  const handleCellClick = (dayIndex, timeIndex) => {
    const cellKey = `${dayIndex}-${timeIndex}`;
    const updatedCells = selectedCells.map((cell) => {
      if (cell.slot === cellKey) {
        return {
          ...cell,
          available: !cell.available, // Toggle the availability
        };
      }
      return cell;
    });

    setSelectedCells(updatedCells);
  };

  // function: handleRowClick selects/deselects all cells in the row by clicking on the weekday name
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
  const handleNavToTimeOff = () => {
    navigate(`/dashboard/timeOff/${selectedAdminInfo._id}`);
  };

  return (
    <Wrapper>
      <ControlPanel>
        <AvailButtons>
          <Reset key={"reset"} onClick={resetSchedule}>
            Reset
          </Reset>
          <Reset key={"save"} onClick={saveChanges}>
            Save Changes
          </Reset>
          <Reset key={"timeOff"} onClick={handleNavToTimeOff}>
            Time Off
          </Reset>
        </AvailButtons>
        <BarberContainer>
          <AdminName onClick={() => setShowBarbers(!showBarbers)}>
            {showBarbers ? "X" : selectedAdminInfo.given_name}
          </AdminName>
          {showBarbers ? (
            <>
              {userInfo.map((barber) => {
                return (
                  <AdminName
                    key={barber.given_name}
                    onClick={(e) => selectBarber(e, barber)}
                  >
                    {barber.given_name}
                  </AdminName>
                );
              })}
            </>
          ) : null}
        </BarberContainer>
      </ControlPanel>

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
  width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 90vh;
  z-index: 1;
`;

const Table = styled.table`
  position: relative;
  top: 10%;
  width: 98%;
  height: 80%;

  td {
    border: 1px solid #3e363f;
    padding: 8px;
    text-align: center;
    height: 40px;
    transition: 0.3s ease-in-out;
    position: relative;
    left: 1%;
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
  width: 100%;
  height: 80vh;
  overflow: auto;
  border-radius: 30px;
`;

const TH = styled.th`
  background-color: #035e3f;
  border: 2px solid transparent;
  color: rgba(255, 255, 255, 0.9);
  transition: 0.2s ease-in-out;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  width: 3.5%;
  position: relative;
  left: 1%;
  &:hover {
    cursor: pointer;
    background-color: white;
    border: #035e3f solid 2px;
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
  left: 4.5%;
  max-width: 94.3%;
`;
const FirstRowDay = styled.div`
  background-color: #035e3f;
  width: 24%;
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

const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  transform: translateX(10%) translateY(100%);
  z-index: 2;
`;

export const AdminName = styled.div`
  border: 3px solid #3e363f;
  border-radius: 5px;
  padding: 5px 10px 5px 10px;
  background-color: transparent;
  color: #3e363f;
  font-size: 25px;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  transition: 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export const BarberContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 20%;
`;

const AvailButtons = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`;

export default TimeSelect;
