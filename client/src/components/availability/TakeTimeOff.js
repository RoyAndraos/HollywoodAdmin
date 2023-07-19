import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { UserContext } from "../contexts/UserContext";
const TakeTimeOff = () => {
  const { barberId } = useParams();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const { userInfo, setUserInfo } = useContext(UserContext);
  useEffect(() => {
    if (startDate !== null && endDate !== null) {
      if (endDate < startDate) {
        const newEndDate = startDate;
        const newStartDate = endDate;
        setStartDate(newStartDate);
        setEndDate(newEndDate);
      }
    }
  }, [startDate, endDate]);
  const handleDateChange = (date) => {
    if (startDate === null) {
      setStartDate(date);
    } else if (startDate !== null && endDate === null) {
      setEndDate(date);
    } else if (startDate !== null && endDate !== null) {
      if (endDate < startDate) {
        const newEndDate = startDate;
        const newStartDate = endDate;
        setStartDate(newStartDate);
        setEndDate(newEndDate);
      } else {
        setStartDate(date);
        setEndDate(null);
      }
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  const handleSubmitTimeOff = (date1, date2) => {
    fetch("/addTimeOff", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: barberId,
        startDate: date1,
        endDate: date2,
      }),
    });
    const userToBeUpdated = userInfo.filter((user) => {
      return user._id === barberId;
    });
    const userIndex = userInfo.findIndex((user) => {
      return user._id === barberId;
    });
    console.log(userToBeUpdated);
    userToBeUpdated[0].time_off.push({
      startDate: date1.toDateString(),
      endDate: date2.toDateString(),
    });
    userInfo[userIndex] = userToBeUpdated[0];
    console.log(userInfo);
  };

  return (
    <Wrapper>
      <CalendarLabelContainer>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          minDate={new Date()}
          key={barberId}
          open={true}
          customInput={<CustomInput />}
          calendarContainer={CalendarContainer}
        />
      </CalendarLabelContainer>
      <ButtonWrapper>
        <StyledLabel>from:</StyledLabel>
        <SelectedDate>{startDate.toDateString()}</SelectedDate>
        <StyledLabel>to:</StyledLabel>
        <SelectedEndDate>
          {endDate ? endDate.toDateString() : startDate.toDateString()}
        </SelectedEndDate>
        <Submit
          onClick={() => {
            handleSubmitTimeOff(startDate, endDate);
          }}
          disabled={startDate === null || endDate === null}
        >
          Submit
        </Submit>
      </ButtonWrapper>
    </Wrapper>
  );
};

const StyledLabel = styled.label`
  font-size: 25px;
  letter-spacing: 2px;
  border-bottom: 2px solid #035e3f;
  width: 30%;
  text-align: center;
`;

const CalendarLabelContainer = styled.div`
  width: 30%;
`;

const CustomInput = styled.input`
  display: none;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  left: 2.5vw;
  top: 1vh;
  width: 95vw;
  height: 80vh;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 30px;
  z-index: 1;
  border: 5px solid #035e3f;
  font-family: "Roboto", sans-serif;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;

const CalendarContainer = styled.div`
  transform: scale(1.4);
  border-radius: 10px;
  left: 10vw;
  top: -15vh;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;
const Submit = styled.button`
  margin-top: 2vh;
  background-color: transparent;
  border: 2px solid #035e3f;
  border-radius: 10px;
  font-size: 20px;
  padding: 10px 15px 10px 15px;
  transition: 0.2s ease-in-out;
  color: #035e3f;
  font-weight: bold;
  letter-spacing: 2px;
  &:hover {
    background-color: #035e3f;
    color: white;
    cursor: pointer;
  }
  &:disabled {
    opacity: 0.5;
    border: 2px solid rgba(0, 0, 0, 0.5);
    color: rgba(0, 0, 0, 0.5);
    &:hover {
      cursor: default;
      background-color: transparent;
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 30%;
  height: 40%;
  padding: 5vh 0 5vh 0;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;
const SelectedDate = styled.div`
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  padding: 5px 10px 5px 10px;
  border-radius: 5px;
`;
const SelectedEndDate = styled.div`
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  padding: 5px 10px 5px 10px;
  border-radius: 5px;
`;
export default TakeTimeOff;
