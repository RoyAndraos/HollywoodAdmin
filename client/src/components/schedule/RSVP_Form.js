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

  const selectNextSlot = (slot) => {
    const day = slot.split("-")[0];
    const timeToEdit = slot.split("-")[1].split(":")[1].slice(0, -2);
    const hour = slot.split("-")[1].split(":")[0];
    let AMPM = slot.slice(-2);
    let newTimeMinute = parseInt(timeToEdit) + 15;
    if (newTimeMinute === 60) {
      newTimeMinute = "00";
      const newHour = parseInt(slot.split("-")[1].split(":")[0]) + 1;
      if (newHour === 12) {
        AMPM = "pm";
        return `${day}-${newHour}:${newTimeMinute}${AMPM}`;
      } else {
        return `${day}-${newHour}:${newTimeMinute}${AMPM}`;
      }
    } else {
      return `${day}-${hour}:${newTimeMinute}${AMPM}`;
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let reservation = {};
    if (selectedService.duration === 1) {
      reservation = {
        barber: selectedBarberForm.given_name,
        date: selectedDate.toDateString(),
        slot: selectedSlot,
        service: selectedService,
        clientName: clientName,
        clientEmail: clientEmail,
        clientNumber: clientNumber,
      };
    } else {
      const newSlotArray = [...selectedSlot, selectNextSlot(selectedSlot[0])];
      reservation = {
        barber: selectedBarberForm.given_name,
        date: selectedDate.toDateString(),
        slot: newSlotArray,
        service: selectedService,
        clientName: clientName,
        clientEmail: clientEmail,
        clientNumber: clientNumber,
      };
    }

    fetch("/addReservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservation: reservation,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        reservation._id = data.data;
        setReservations([...reservations, reservation]);
      });

    setSelectedSlot("");
    setBarber({});
    setClientName("");
    setClientEmail("");
    setClientNumber("");
    setSelectedService("");
    setError(true);
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
          <StyledLabel>Date</StyledLabel>
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
          <StyledLabel>Client Name</StyledLabel>
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
          <StyledLabel>Client Email</StyledLabel>
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
          <StyledLabel>Client Number</StyledLabel>
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

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledForm = styled.form`
  display: flex;
  border: 1px solid #ccc;
  width: 100%;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-family: "Roboto", sans-serif;
`;

const CustomDatePicker = styled(DatePicker)`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #ccc;
  width: 30vw;
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
  top: -9vh;
  left: -7vw;
  animation: ${fadeIn} 0.2s ease-in-out;
  transform: scale(1.3) translateX(40%) translateY(40%);
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;

export const SelectedSlotContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const StyledLabel = styled.label`
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-radius: -5px;
  width: 100%;
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
  width: 30vw;
  padding: 10px 0 10px 0;
  &:hover {
    background-color: #ccc;
  }
  &:focus {
    outline: none;
  }
`;

const Book = styled.button`
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
  margin-bottom: 30px;

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
