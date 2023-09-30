import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { NotificationContext } from "../contexts/NotficationContext";
const TakeTimeOff = () => {
  const { barberId } = useParams();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const { setNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const barber = userInfo.filter((user) => {
    return user._id === barberId;
  });
  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "short", day: "numeric", month: "short" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  useEffect(() => {
    if (startDate !== null && endDate !== null) {
      if (endDate < startDate) {
        const newEndDate = startDate;
        const newStartDate = endDate;
        setStartDate(newStartDate);
        setEndDate(newEndDate);
      }
    }
  }, [startDate, endDate, userInfo]);
  const handleDateChange = (date) => {
    if (startDate === null) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      setStartDate(startOfDay);
    } else if (startDate !== null && endDate === null) {
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      setEndDate(endOfDay);
    } else if (startDate !== null && endDate !== null) {
      if (endDate < startDate) {
        const newEndDate = startDate;
        const newStartDate = endDate;
        const startOfDay = new Date(newStartDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(newEndDate);
        endOfDay.setHours(23, 59, 59, 999);
        setStartDate(startOfDay);
        setEndDate(endOfDay);
      } else {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 1);
        setStartDate(startOfDay);
        setEndDate(null);
      }
    } else {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      setStartDate(startOfDay);
      setEndDate(null);
    }
  };
  const handleDeleteTimeOff = (timeOff) => {
    fetch("/deleteTimeOff", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: barberId,
        startDate: timeOff.startDate,
        endDate: timeOff.endDate,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setNotification("Time off deleted successfully");
        }
      })
      .catch(() => {
        setNotification("Something went wrong");
      });

    const updatedUserList = userInfo.map((user) => {
      if (user._id === barberId) {
        const updatedTimeOffList = user.time_off.filter((to) => {
          return (
            to.startDate !== timeOff.startDate || to.endDate !== timeOff.endDate
          );
        });
        return { ...user, time_off: updatedTimeOffList };
      }
      return user;
    });

    setUserInfo(updatedUserList);
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
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setNotification("Time off added successfully");
        }
      })
      .catch(() => {
        setNotification("Something went wrong");
      });
    const updatedUserList = userInfo.map((user) => {
      if (user._id === barberId) {
        return {
          ...user,
          time_off: [
            ...user.time_off,
            {
              startDate: date1,
              endDate: date2,
            },
          ],
        };
      }
      return user;
    });

    setUserInfo(updatedUserList);
  };
  const handleExit = (e) => {
    e.preventDefault();
    navigate("/dashboard/availability");
  };
  return (
    <Wrapper>
      <BackButton onClick={(e) => handleExit(e)}>
        <FaArrowLeft />
      </BackButton>
      <CalendarLabelContainer>
        <DatePicker
          selected={new Date(startDate.setHours(0, 0, 0, 0))}
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
      <ButtonWrapper>
        {barber[0].time_off.length !== 0 ? (
          barber[0].time_off.map((timeOff) => {
            return (
              <TimeOffContainer key={timeOff.startDate}>
                {formatDateString(timeOff.startDate)} -{" "}
                {formatDateString(timeOff.endDate)}
                <Delete onClick={() => handleDeleteTimeOff(timeOff)}>X</Delete>
              </TimeOffContainer>
            );
          })
        ) : (
          <div>No time off scheduled</div>
        )}
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
  justify-content: space-evenly;
  width: 30%;
  height: 70%;
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

const BackButton = styled.button`
  position: absolute;
  font-size: 3rem;
  border: none;
  background-color: transparent;
  color: #035e3f;
  opacity: 0.6;
  transition: 0.3s ease-in-out;
  top: 5vh;
  left: 5vw;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;
const TimeOffContainer = styled.div`
  width: 70%;
  border: 2px solid #035e3f;
  border-radius: 10px;
  padding: 10px;
  position: relative;
`;
const Delete = styled.button`
  background-color: #ad0606;
  border: none;
  border-radius: 10px;
  color: whitesmoke;
  position: absolute;
  padding: 5px 8px 5px 8px;
  top: 5px;
  right: 5px;
  transition: 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export default TakeTimeOff;
