import React, { useState, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled, { keyframes } from "styled-components";
import { UserContext } from "./UserContext";
import { ReservationContext } from "./ReservationContext";
const AddReservation = () => {
  const { userInfo } = useContext(UserContext);
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
  const [error, setError] = useState(true);
  console.log(userInfo);
  const handleSubmit = (e) => {
    e.preventDefault();
    const reservation = {
      barber: selectedBarberForm.given_name,
      date: formatDate(selectedDate),
      slot: selectedSlot,
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

  const handleFormatDateForSlots = (date) => {
    const options = { weekday: "short" };
    return date.toLocaleDateString(undefined, options);
  };

  const handleSelectSlot = (slot, e) => {
    e.preventDefault();
    setSelectedSlot(slot);
  };

  const handleSelectAnotherSlot = () => {
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
            value={formatDate(selectedDate)}
            calendarContainer={CalendarContainer}
          />
        </LabelInputWrapper>
        <LabelInputWrapper>
          <StyledLabel>Barber:</StyledLabel>
          <div style={{ widh: "40vw", marginLeft: "4px" }}>
            {Object.keys(selectedBarberForm).length === 0 ? (
              userInfo.map((barber) => (
                <BarberSlot
                  key={barber.given_name}
                  onClick={() => {
                    setBarber(barber);
                  }}
                >
                  {barber.given_name}
                </BarberSlot>
              ))
            ) : (
              <BarberSlot onClick={() => setBarber({})}>
                {selectedBarberForm.given_name}
              </BarberSlot>
            )}
          </div>
        </LabelInputWrapper>
        <LabelInputWrapper>
          <StyledLabel>timeSlot:</StyledLabel>
          <SlotContainer>
            {selectedSlot === "" ? (
              <SlotContainer>
                {Object.keys(selectedBarberForm).length !== 0 ? (
                  selectedBarberForm.availability.map((slot) => {
                    if (slot.includes(handleFormatDateForSlots(selectedDate))) {
                      return (
                        <Slot
                          key={slot}
                          onClick={(e) => {
                            handleSelectSlot(slot, e);
                          }}
                        >
                          {slot.split("-")[1]}
                        </Slot>
                      );
                    } else {
                      return null;
                    }
                  })
                ) : (
                  <SelectedSlotContainer>
                    <SelectedSlot>select barber first</SelectedSlot>
                  </SelectedSlotContainer>
                )}
              </SlotContainer>
            ) : (
              <SelectedSlotContainer>
                <SelectedSlot
                  onClick={() => {
                    handleSelectAnotherSlot();
                  }}
                >
                  {selectedSlot.split("-")[1]}
                </SelectedSlot>
              </SelectedSlotContainer>
            )}
          </SlotContainer>
        </LabelInputWrapper>
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
const LabelInputWrapper = styled.div`
  margin-top: 2vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 76vh;
  font-family: "Roboto", sans-serif;
`;
const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 50%;
  transform: translateX(-50%);
`;
const CustomDatePicker = styled(DatePicker)`
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 16px;
  width: 500px;
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
const Slot = styled.div`
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: center;
  margin: 5px 5px 0 0;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
`;

const SelectedSlot = styled.div`
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: center;
  margin: 5px 5px 0 0;
  transition: 0.3s ease-in-out;
  width: 500px;
  padding: 5px 10px 5px 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
`;

const SlotContainer = styled.div`
  display: grid;
  grid-template-columns: 33% 33% 33%;
  width: 500px;
  justify-content: space-evenly;
  align-items: center;
  line-height: 30px;
`;
const SelectedSlotContainer = styled.div`
  display: flex;
  width: 500px;
  justify-content: center;
`;

const BarberSlot = styled.div`
  border: 1px solid #ccc;
  background-color: #fff;
  width: 500px;
  padding: 5px 10px 5px 10px;
  text-align: center;
  margin: 10px 5px 0 0;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
`;

const StyledLabel = styled.label`
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 600;
  margin-bottom: 5px;
`;

const StyledInput = styled.input`
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: center;
  margin: 5px 5px 0 0;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  font-size: 15px;
  width: 100%;

  margin-left: 5px;
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
  margin: 5px 5px 0 0;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  margin-left: 5px;
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
  left: 6.1vw;
  bottom: -30%;
`;
export default AddReservation;
