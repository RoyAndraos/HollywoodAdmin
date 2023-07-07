import React, { useState, useContext } from "react";
import DatePicker from "react-datepicker";
import BarberSelect from "./rsvpComponents/BarberSelect";
import "react-datepicker/dist/react-datepicker.css";
import styled, { keyframes } from "styled-components";
import { ReservationContext } from "../contexts/ReservationContext";
import ServiceSelector from "./rsvpComponents/ServiceSelector";
import SlotSelector from "./rsvpComponents/SlotSelector";
const AddReservation = () => {
  const { reservations, setReservations } = useContext(ReservationContext);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedBarberForm, setBarber] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [emailError, setEmailError] = useState("");
  const [numberError, setNumberError] = useState("");
  const [nameError, setNameError] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [error, setError] = useState(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    const reservation = {
      barber: selectedBarberForm.given_name,
      date: selectedDate.toDateString(),
      slot: selectedSlot,
      service: selectedService,
      clientName: clientName,
      clientEmail: clientEmail,
      clientNumber: clientNumber,
    };
    setReservations([...reservations, reservation]);
    fetch("/addReservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservation: reservation,
      }),
    });
  };

  const handleChange = (e, name) => {
    e.preventDefault();
    switch (name) {
      case "email":
        //set email
        setClientEmail(e.target.value);
        //check email
        const validEmail = (email) => {
          if (!email.includes("@") || !email.includes(".")) {
            return false;
          }
          //get index for . and @ to make sure . comes after @
          const atIndex = email.indexOf("@");
          const lastDotIndex = email.lastIndexOf(".");
          if (lastDotIndex < atIndex) {
            return false;
          }
          return true;
        };
        if (e.target.value.length === 0) {
          setEmailError("");
        } else {
          if (!validEmail(e.target.value)) {
            setEmailError("invalid email");
            setError(true);
          } else {
            setEmailError("");
            if (nameError === "" && numberError === "") {
              setError(false);
            }
          }
        }
        break;
      case "number":
        setClientNumber(e.target.value);
        //check number
        if (e.target.value.length === 0) {
          setNumberError("");
        } else {
          if (isNaN(e.target.value) || e.target.value.length !== 10) {
            setNumberError("invalid phone number");
            setError(true);
          } else {
            setNumberError("");
            if (emailError === "" && nameError === "") {
              setError(false);
            }
          }
        }
        break;
      case "name":
        setClientName(e.target.value);
        if (e.target.value.length <= 2) {
          setNameError("name is required");
          setError(true);
        } else {
          setNameError("");
          if (emailError === "" && numberError === "") {
            setError(false);
          }
        }
        break;
      default:
        break;
    }
  };

  const formatDate = (date) => {
    const options = { month: "short", weekday: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot("");
  };

  return (
    <Wrapper>
      <StyledForm
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <LabelInputWrapper>
          <StyledLabel>Date:</StyledLabel>
          <CustomDatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            calendarContainer={CalendarContainer}
          />
        </LabelInputWrapper>
        <BarberSelect
          selectedBarberForm={selectedBarberForm}
          setBarber={setBarber}
        />
        <ServiceSelector
          selectedService={selectedService}
          setSelectedService={setSelectedService}
        />
        <SlotSelector
          selectedSlot={selectedSlot}
          selectedBarberForm={selectedBarberForm}
          selectedService={selectedService}
          selectedDate={selectedDate}
          setSelectedSlot={setSelectedSlot}
        />
        <LabelInputWrapper>
          <StyledLabel>Client Name:</StyledLabel>
          <SelectedSlotContainer>
            <StyledInput
              type="text"
              placeholder="Name"
              name="name"
              required
              onChange={(e) => {
                handleChange(e, e.target.name);
              }}
            ></StyledInput>
          </SelectedSlotContainer>
          {nameError !== "" && <ErrorMessage>{nameError}</ErrorMessage>}
        </LabelInputWrapper>
        <LabelInputWrapper>
          <StyledLabel>Client Email:</StyledLabel>
          <SelectedSlotContainer>
            <StyledInput
              type="text"
              placeholder="email@example.com (Optional)"
              name="email"
              onChange={(e) => {
                handleChange(e, e.target.name);
              }}
            ></StyledInput>
          </SelectedSlotContainer>
          {emailError !== "" && <ErrorMessage>{emailError}</ErrorMessage>}
        </LabelInputWrapper>
        <LabelInputWrapper>
          <StyledLabel>Client Number:</StyledLabel>
          <SelectedSlotContainer>
            <StyledInput
              type="text"
              placeholder="(514) 430-4287 (Optional)"
              name="number"
              onChange={(e) => {
                handleChange(e, e.target.name);
              }}
            ></StyledInput>
          </SelectedSlotContainer>
          {numberError !== "" && <ErrorMessage>{numberError}</ErrorMessage>}
        </LabelInputWrapper>
        <LabelInputWrapper>
          <Book type="submit" disabled={error}>
            Book
          </Book>
        </LabelInputWrapper>
      </StyledForm>
    </Wrapper>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 76vh;
  font-family: "Roboto", sans-serif;
`;
const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 50%;
  transform: translateX(-50%);
  top: -10px;
`;
const CustomDatePicker = styled(DatePicker)`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #ccc;
  width: 20vw;
  padding: 5px 0 5px 0;
  font-size: 16px;
  caret-color: transparent;
  text-align: center;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
`;
const CalendarContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  position: absolute;
  animation: ${fadeIn} 0.2s ease-in-out;
  transform: scale(2) translateX(40%) translateY(40%);
`;
export const Slot = styled.div`
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: center;
  margin: 5px 5px 0 0;
  transition: 0.3s ease-in-out;
  width: 20vw;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
`;

export const SelectedSlotContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const BarberSlot = styled.div`
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 5px 0 5px 0;
  text-align: center;
  margin: 10px 5px 0 0;
  width: 20vw;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
  &:first-of-type {
    margin-top: 0;
  }
`;

export const StyledLabel = styled.label`
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-radius: -5px;
  width: 100%;
  text-align: center;
  border-bottom: 3px solid #035e3f;
  color: #035e3f;
`;

export const LabelInputWrapper = styled.div`
  margin-top: 2vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
  background-color: transparent;
  width: 30vw;
`;

const StyledInput = styled.input`
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: center;
  margin: 5px 0 0 0;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  font-size: 15px;
  width: 20vw;
  padding: 10px 0 10px 0;
  &:hover {
    background-color: #ccc;
  }
  &:focus {
    outline: none;
  }
`;

const Book = styled.button`
  position: relative;
  top: 10px;
  border-radius: 10px;
  border: 2px solid transparent;
  width: 15vw;
  background-color: #035e3f;
  color: white;
  padding: 10px 20px 10px 20px;
  text-align: center;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  font-size: 20px;

  &:hover {
    background-color: whitesmoke;
    color: #035e3f;
    border: 2px solid #035e3f;
    cursor: pointer;
  }
  &:active {
    transform: scale(0.95);
  }
  &:disabled {
    background-color: #aaa;
    &:hover {
      cursor: default;
      border: 2px solid transparent;
      color: white;
    }
  }
`;

const ErrorMessage = styled.span`
  color: red;
  position: absolute;
  left: 0;
  bottom: -30%;
`;
export default AddReservation;
