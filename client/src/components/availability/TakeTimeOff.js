import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "./datepick.css";
import styled from "styled-components";
import { UserContext } from "../contexts/UserContext";
import { NotificationContext } from "../contexts/NotficationContext";
import { BarberContainer, AdminName } from "./TimeSelect";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ReservationContext } from "../contexts/ReservationContext";
import { ServicesContext } from "../contexts/ServicesContext";
import { TextContext } from "../contexts/TextContext";
import Loader from "../Loader";
import { ClientsContext } from "../contexts/ClientsContext";
import { EmployeeServicesContext } from "../contexts/EmployeeServicesContext";

const TakeTimeOff = () => {
  // useState/useContext: start date of time off, end date of time off, user info to see who's selected, notification
  const { barberId } = useParams();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const { setNotification } = useContext(NotificationContext);
  const [showBarbers, setShowBarbers] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState();
  //get the selected barber

  const navigate = useNavigate();
  //popper element is the calendar that pops up when you click on the datepicker
  //in this case, its always popped up and the input box is hidden (check styled components below)
  //theres inline styling imported with the react-datepicker module
  //so we have to override it with this useEffect (after the component mounts)
  const popper = document.getElementsByClassName("react-datepicker-popper");
  const { setReservations, reservations } = useContext(ReservationContext);
  const { setServices, services } = useContext(ServicesContext);
  const { clients, setClients } = useContext(ClientsContext);
  const { servicesEmp, setServicesEmp } = useContext(EmployeeServicesContext);
  const { setText, text } = useContext(TextContext);

  useEffect(() => {
    if (!userInfo) {
      const token = Cookies.get("token");
      if (!token) {
        return;
      } else {
        const headers = {
          authorization: token,
        };
        fetch(`/https://hollywood-fairmount-admin.onrender.com/getUserInfo`, {
          headers,
        })
          .then((res) => res.json())
          .then((result) => {
            setUserInfo(result.userInfo);
            setReservations(result.reservations);
            setServices(result.services);
            setText(result.text);
            setClients(result.clients);
            setServicesEmp(result.employeeServices);
          });
      }
    }
  }, [
    setReservations,
    setServices,
    setUserInfo,
    setText,
    userInfo,
    setClients,
    setServicesEmp,
  ]);
  useEffect(() => {
    const barber = userInfo.filter((barber) => barber._id === barberId);
    setSelectedBarber(barber[0]);
  }, [barberId, userInfo]);
  useEffect(() => {
    if (popper.length !== 0) {
      popper[0].style.position = "relative";
    }
  }, [popper]);
  //format date string to look like "Mon Jan 1"
  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "short", day: "numeric", month: "short" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  //if the start date is after the end date, swap them
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

  //function: when the datepicker is changed, set the start date to the selected date
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
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        setEndDate(endOfDay);
      }
    } else {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      setStartDate(startOfDay);
      setEndDate(null);
    }
  };
  //function: delete time off from the database and the context
  const handleDeleteTimeOff = (timeOff) => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };

    fetch("https://hollywood-fairmount-admin.onrender.com/deleteTimeOff", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...headers,
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

  //function: submit time off to the database and the context
  const handleSubmitTimeOff = (date1, date2) => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    fetch("https://hollywood-fairmount-admin.onrender.com/addTimeOff", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
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

  const selectBarber = (e, barber) => {
    e.preventDefault();
    setShowBarbers(false);
    navigate(`/timeOff/${barber._id}`);
  };
  if (
    !reservations ||
    !services ||
    !text ||
    !userInfo ||
    !clients ||
    !servicesEmp ||
    !selectedBarber
  )
    return <Loader />;
  return (
    <Wrapper>
      <BarberContainer>
        <AdminName onClick={() => setShowBarbers(!showBarbers)}>
          {showBarbers ? "X" : selectedBarber.given_name}
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
      <ControlPannel>
        <ButtonWrapper>
          <DatePicker
            selected={new Date(startDate.setHours(0, 0, 0, 0))}
            onChange={handleDateChange}
            minDate={new Date()}
            key={barberId}
            open={true}
            customInput={<CustomInput />}
          />
        </ButtonWrapper>
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
          {selectedBarber.time_off.length !== 0 ? (
            selectedBarber.time_off.map((timeOff) => {
              return (
                <TimeOffContainer key={timeOff.startDate + timeOff.endDate}>
                  {formatDateString(timeOff.startDate)} -{" "}
                  {formatDateString(timeOff.endDate)}
                  <Delete onClick={() => handleDeleteTimeOff(timeOff)}>
                    X
                  </Delete>
                </TimeOffContainer>
              );
            })
          ) : (
            <div style={{ fontSize: "1.2rem" }}>No time off scheduled</div>
          )}
        </ButtonWrapper>
      </ControlPannel>
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

const CustomInput = styled.input`
  display: none;
`;
const ControlPannel = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100%;
`;
const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: 10% 90%;
  align-items: center;
  left: 1vw;
  top: 1vh;
  width: 98vw;
  height: 86vh;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1;
  font-family: "Roboto", sans-serif;
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
  height: 60%;
  padding: 5vh 0 5vh 0;
  border-radius: 20px;
  border: 2px solid #035e3f;
  position: relative;
`;
const SelectedDate = styled.div`
  padding: 5px 10px 5px 10px;
  border-radius: 5px;
  border: 2px solid #035e3f;
`;
const SelectedEndDate = styled.div`
  padding: 5px 10px 5px 10px;
  border-radius: 5px;
  border: 2px solid #035e3f;
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
