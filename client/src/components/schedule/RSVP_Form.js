import { useState, useContext, useEffect } from "react";
import DatePicker from "react-datepicker";
import BarberSelect from "./rsvpComponents/BarberSelect";
import "react-datepicker/dist/react-datepicker.css";
import styled, { keyframes } from "styled-components";
import { ReservationContext } from "../contexts/ReservationContext";
import ServiceSelector from "./rsvpComponents/ServiceSelector";
import SlotSelector from "./rsvpComponents/SlotSelector";
import { NotificationContext } from "../contexts/NotficationContext";
import Cookies from "js-cookie";
const AddReservation = ({
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
}) => {
  const { reservations, setReservations } = useContext(ReservationContext);
  const { setNotification } = useContext(NotificationContext);
  const [selectedBarberForm, setBarber] = useState({});
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [emailError, setEmailError] = useState("");
  const [numberError, setNumberError] = useState("");
  const [nameError, setNameError] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [error, setError] = useState(true);
  const [existingClient, setExistingClient] = useState([]);
  const [barberError, setBarberError] = useState(false);
  const [serviceError, setServiceError] = useState(false);
  useEffect(() => {
    // Update input fields when existing client is selected
    if (existingClient.length > 0) {
      setClientName(existingClient.fname + " " + existingClient.lname);
      setClientEmail(existingClient.email);
      setClientNumber(existingClient.number);
    }
  }, [existingClient]);
  //check if barber is selected
  useEffect(() => {
    if (Object.keys(selectedBarberForm).length === 0) {
      setBarberError(true);
    } else {
      setBarberError(false);
    }
    if (Object.keys(selectedService).length === 0) {
      setServiceError(true);
    } else {
      setServiceError(false);
    }
  }, [selectedBarberForm, selectedService]);

  //searches for client data (when admin enters name in the client name input)
  const fetchClientData = async (name) => {
    if (name.length <= 2) {
      setExistingClient([]);
      return;
    }

    try {
      const response = await fetch(
        `https://hollywood-fairmount-admin.onrender.com/clientByName/${name}`
      );
      const data = await response.json();
      if (data.data) {
        setExistingClient(data.data);
      }
    } catch (error) {
      setNotification("Something went wrong");
    }
  };
  // when a service has a duration of 2 (meaning 2 slots), this function will select the next slot aka the slot that
  //was clicked and the one that comes after it
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

  //submit reservation
  const handleSubmit = (e) => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    e.preventDefault();
    let reservation = {};
    if (selectedService.duration === 1) {
      reservation = {
        barber: selectedBarberForm.given_name,
        date: selectedDate.toDateString(),
        slot: selectedSlot,
        service: selectedService,
        fname: clientName.split(" ")[0],
        lname: clientName.split(" ")[1] || "",
        email: clientEmail,
        number: clientNumber,
      };
    } else {
      const newSlotArray = [...selectedSlot, selectNextSlot(selectedSlot[0])];
      reservation = {
        barber: selectedBarberForm.given_name,
        date: selectedDate.toDateString(),
        slot: newSlotArray,
        service: selectedService,
        fname: clientName.split(" ")[0],
        lname: clientName.split(" ")[1] || "",
        email: clientEmail,
        number: clientNumber,
      };
    }
    fetch("https://hollywood-fairmount-admin.onrender.com/addReservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        reservation: reservation,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          console.log(data);
          reservation._id = data.res_id;
          reservation.client_id = data.client_id;
          setReservations([...reservations, reservation]);
          setNotification("Reservation added successfully");
        }
      })
      .catch(() => setNotification("Something went wrong"));
    setSelectedSlot("");
    setBarber({});
    setClientName("");
    setClientEmail("");
    setClientNumber("");
    setSelectedService("");
    setError(true);
  };

  //saves input data to state and checks for errors
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
        if (e.target.value.length > 2) {
          // If the entered name has more than 3 letters, fetch client data
          fetchClientData(e.target.value);
        }
        if (e.target.value.length <= 2) {
          setNameError("Name is required");
          setError(true);
          fetchClientData(e.target.value);
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
  //saves date to state
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot("");
  };
  return (
    <Wrapper>
      <Title>Make a reservation</Title>
      <StyledForm
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div>
          <LabelInputWrapper>
            <StyledLabel>Client Name</StyledLabel>
            <SelectedSlotContainer>
              <StyledInput
                type="text"
                placeholder="Name"
                name="name"
                id="clientname"
                required
                onChange={(e) => {
                  handleChange(e, e.target.name);
                }}
              ></StyledInput>
              {existingClient.length && (
                <ExistingClientSelect>
                  <StyledClose
                    onClick={() => {
                      setExistingClient([]);
                    }}
                  >
                    X
                  </StyledClose>
                  {existingClient.map((client) => {
                    return (
                      <Client
                        key={client._id}
                        onClick={() => {
                          setExistingClient([]);
                          setClientEmail(client.email);
                          setClientNumber(client.number);
                          setClientName(client.fname + " " + client.lname);
                          document.getElementById("clientname").value =
                            client.fname + " " + client.lname;
                        }}
                      >
                        {client.fname} {client.lname} <br />
                        {client.email}
                        <br />
                        {client.number}
                      </Client>
                    );
                  })}
                </ExistingClientSelect>
              )}
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
                value={clientEmail}
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
                placeholder="5144304287 (Optional)"
                name="number"
                defaultValue={clientNumber}
                onChange={(e) => {
                  handleChange(e, e.target.name);
                }}
              ></StyledInput>
            </SelectedSlotContainer>
            {numberError !== "" && <ErrorMessage>{numberError}</ErrorMessage>}
          </LabelInputWrapper>
        </div>
        <div>
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
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
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
          <Book type="submit" disabled={error || barberError || serviceError}>
            Book
          </Book>
        </div>
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
  flex-direction: column;
  height: 100vh;
  background-color: #011c13;
  border-radius: 20px;
  @media (max-width: 768px) {
    height: unset;
    margin-top: 5vh;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-family: "Roboto", sans-serif;
  color: whitesmoke;
  background-color: #035e3f;
  margin-top: 0;
  border-radius: 20px;
  padding: 20px 0 20px 0;
  @media (max-width: 768px) {
    font-size: clamp(20px, 22px, 26px);
  }
`;

const StyledForm = styled.form`
  display: flex;
  width: 99%;
  position: relative;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-start;
  font-family: "Roboto", sans-serif;
  height: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CustomDatePicker = styled(DatePicker)`
  position: relative;
  left: 50%;
  top: 4px;
  transform: translateX(-50%);
  border: 1px solid #ccc;
  width: 30vw;
  padding: 5px 0 5px 0;
  caret-color: transparent;
  text-align: center;
  transition: 0.3s ease-in-out;
  font-size: clamp(16px, 18px, 22px);
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  padding: 10px 0 10px 0;
  background-color: #035e3f;
  border: 1px solid transparent;
  color: whitesmoke;
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
  @media (max-width: 768px) {
    width: 80vw;
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
  @media (max-width: 768px) {
    left: -45vw;
    top: -5vh;
  }
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
  border-bottom: 1px solid #035e3f;
  color: #049f6a;
  margin: 20px 0 10px 0;
  @media (max-width: 768px) {
    width: 80vw;
  }
`;

export const LabelInputWrapper = styled.div`
  margin-top: 2vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
  background-color: transparent;
  font-size: 1.2rem;
  width: 30vw;
`;

const StyledInput = styled.input`
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: center;
  margin: 5px 0 0 0;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  font-size: clamp(16px, 18px, 22px);
  width: 30vw;
  padding: 10px 0 10px 0;
  &:hover {
    background-color: #ccc;
  }
  &:focus {
    outline: none;
  }
  @media (max-width: 768px) {
    width: 80vw;
  }
`;

const Book = styled.button`
  border-radius: 10px;
  border: 2px solid transparent;
  width: 15vw;
  background-color: #035e3f;
  position: relative;
  color: white;
  padding: 10px 20px 10px 20px;
  text-align: center;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  font-size: 20px;
  margin: 50px 0px;
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
  @media (max-width: 768px) {
    width: 60vw;
    margin: 50px 0 100px 0;
  }
`;

const ErrorMessage = styled.span`
  color: red;
  position: absolute;
  left: 0;
  bottom: -30%;
`;
const ExistingClientSelect = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #035e3f;
  color: white;
  padding: 10px 0;
  z-index: 100;
`;
const Client = styled.div`
  padding: 10px 0;
  text-align: center;
  transition: 0.3s ease-in-out;
  &:hover {
    background-color: #049f6a;
    cursor: pointer;
  }
`;
const StyledClose = styled.button`
  position: absolute;
  right: 5px;
  top: 5px;
  padding: 5px 8px;
  transition: 0.3s ease-in-out;
  border: 2px solid transparent;
  background-color: #035e3f;
  color: whitesmoke;
  border-radius: 50%;
  &:hover {
    background-color: #049f6a;
    border: 2px solid white;
    cursor: pointer;
  }
`;
export default AddReservation;
