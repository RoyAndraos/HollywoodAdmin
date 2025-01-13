import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "./datepick.css";
import styled from "styled-components";
import { UserContext } from "../contexts/UserContext";
import { NotificationContext } from "../contexts/NotficationContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ReservationContext } from "../contexts/ReservationContext";
import { ServicesContext } from "../contexts/ServicesContext";
import { TextContext } from "../contexts/TextContext";
import Loader from "../Loader";
import { ClientsContext } from "../contexts/ClientsContext";
// import { EmployeeServicesContext } from "../contexts/EmployeeServicesContext";
import format from "date-fns/format"; // Importing date-fns to format dates
import { BlockedSlotsContext } from "../contexts/BlockedSlotsContext";

const TakeTimeOff = () => {
  const { barberId } = useParams();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const { setNotification } = useContext(NotificationContext);
  const [showBarbers, setShowBarbers] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState();
  const navigate = useNavigate();
  const { setReservations, reservations } = useContext(ReservationContext);
  const { setServices, services } = useContext(ServicesContext);
  const { clients, setClients } = useContext(ClientsContext);
  // const { servicesEmp, setServicesEmp } = useContext(EmployeeServicesContext);
  const { setText, text } = useContext(TextContext);
  const { blockedSlots, setBlockedSlots } = useContext(BlockedSlotsContext);

  useEffect(() => {
    if (!userInfo) {
      const token = Cookies.get("token");
      if (!token) {
        return;
      } else {
        const headers = {
          authorization: token,
        };
        fetch(`https://hollywood-fairmount-admin.onrender.com/getUserInfo`, {
          headers,
        })
          .then((res) => res.json())
          .then((result) => {
            setUserInfo(result.userInfo);
            setReservations(result.reservations);
            setServices(result.services);
            setText(result.text);
            // setServicesEmp(result.employeeServices);
            setClients(result.clients);
            setBlockedSlots(result.blockedSlots);
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
    setBlockedSlots,
    // setServicesEmp,
  ]);

  useEffect(() => {
    const barber = userInfo.filter((barber) => barber._id === barberId);
    setSelectedBarber(barber[0]);
  }, [barberId, userInfo]);

  // Adjusted function for date range selection
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSubmitTimeOff = () => {
    if (!startDate || !endDate) {
      setNotification("Please select both start and end dates.");
      return;
    }

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
        startDate: startDate,
        endDate: endDate,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setNotification("Time off added successfully");
          setUserInfo(
            userInfo.map((barber) => {
              if (barber._id === barberId) {
                return {
                  ...barber,
                  time_off: [
                    ...barber.time_off,
                    { startDate: startDate, endDate: endDate },
                  ],
                };
              }
              return barber;
            })
          );
        } else {
          setNotification("Failed to add time off");
        }
      })
      .catch(() => {
        setNotification("Something went wrong");
      });
  };
  const handleDeleteTimeOff = (startDate, endDate) => {
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
        startDate: startDate,
        endDate: endDate,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setNotification("Time off deleted successfully");
          setUserInfo(
            userInfo.map((barber) => {
              if (barber._id === barberId) {
                return {
                  ...barber,
                  time_off: barber.time_off.filter(
                    (timeOff) =>
                      timeOff.startDate !== startDate ||
                      timeOff.endDate !== endDate
                  ),
                };
              }
              return barber;
            })
          );
        } else {
          setNotification("Failed to delete time off");
        }
      })
      .catch(() => {
        setNotification("Something went wrong");
      });
  };
  if (
    !reservations ||
    !services ||
    !text ||
    !userInfo ||
    !clients ||
    // !servicesEmp ||
    !blockedSlots ||
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
            {userInfo.map((barber) => (
              <AdminName
                key={barber.given_name}
                onClick={() => {
                  setShowBarbers(false);
                  navigate(`/timeOff/${barber._id}`);
                }}
              >
                {barber.given_name}
              </AdminName>
            ))}
          </>
        ) : null}
      </BarberContainer>

      <ControlPannel>
        <DatePickerWrapper>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            minDate={new Date()}
          />
        </DatePickerWrapper>
        <SelectedDates>
          <p>
            Start Date:{" "}
            {startDate ? format(startDate, "MMMM d, yyyy") : "Not selected"}
          </p>
          <p>
            End Date:{" "}
            {endDate ? format(endDate, "MMMM d, yyyy") : "Not selected"}
          </p>
        </SelectedDates>
        <SelectedDates>
          {selectedBarber.time_off.map((timeOff) => (
            <p key={timeOff.startDate}>
              {format(new Date(timeOff.startDate), "MMMM d, yyyy")} -{" "}
              {format(new Date(timeOff.endDate), "MMMM d, yyyy")}
              <button
                onClick={() =>
                  handleDeleteTimeOff(timeOff.startDate, timeOff.endDate)
                }
              >
                Delete
              </button>
            </p>
          ))}
        </SelectedDates>
        <Submit onClick={handleSubmitTimeOff} disabled={!startDate || !endDate}>
          Submit
        </Submit>
      </ControlPannel>
    </Wrapper>
  );
};
const DatePickerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px; /* Adjust this to properly space it from the top */
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: fit-content; /* Ensures the wrapper fits snugly around the DatePicker */
  position: relative;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: "Roboto", sans-serif;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const ControlPannel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px; /* Pushes the panel away from the top */
  width: 100%;
`;

const SelectedDates = styled.div`
  margin-top: 15px;
  width: 100%;
  text-align: center;

  p {
    font-size: 16px;
    margin: 5px 0;
    color: #333;
  }

  button {
    margin-left: 10px;
    padding: 5px 10px;
    font-size: 14px;
    color: #fff;
    background-color: #d9534f;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #c9302c;
    }

    &:focus {
      outline: none;
    }
  }
`;

const Submit = styled.button`
  margin-top: 20px;
  background-color: transparent;
  border: 2px solid #035e3f;
  border-radius: 10px;
  font-size: 18px;
  padding: 12px 20px;
  transition: all 0.3s ease;
  color: #035e3f;
  font-weight: bold;
  letter-spacing: 1.5px;

  &:hover {
    background-color: #035e3f;
    color: white;
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.5;
    border-color: rgba(0, 0, 0, 0.5);
    color: rgba(0, 0, 0, 0.5);

    &:hover {
      cursor: default;
      background-color: transparent;
    }
  }
`;

const AdminName = styled.p`
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  color: #035e3f;
  margin: 10px 0;
  transition: color 0.2s ease;

  &:hover {
    color: #048653;
  }
`;

const BarberContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
`;

export default TakeTimeOff;
