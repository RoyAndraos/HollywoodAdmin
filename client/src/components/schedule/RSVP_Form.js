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
import { IsMobileContext } from "../contexts/IsMobileContext";
import { getClientByNumber, getClientsByName, highlightText } from "../helpers";
import { ClientsContext } from "../contexts/ClientsContext";
import Reminder from "./rsvpComponents/Reminder";
import { BlockedSlotsContext } from "../contexts/BlockedSlotsContext";

const AddReservation = ({
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
  slotBeforeCheck,
  setSlotBeforeCheck,
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
  const [overLappingError, setOverLappingError] = useState(false);
  const [sendSMS, setSendSMS] = useState(true);
  const { isMobile } = useContext(IsMobileContext);
  const { clients } = useContext(ClientsContext);
  const [sendEmail, setSendEmail] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const { blockedSlots, setBlockedSlots } = useContext(BlockedSlotsContext);
  const handleBlockSlot = (slot, date, barber) => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    const formattedDate = date.toDateString();
    const block = {
      barber: barber.given_name,
      date: formattedDate,
      slot: slot,
    };
    fetch("https://hollywood-fairmount-admin.onrender.com/blockSlot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        block: block,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setNotification("Slot blocked successfully");
          setBlockedSlots([
            ...blockedSlots,
            {
              _id: data._id,
              barber: barber.given_name,
              date: formattedDate,
              slot: slot,
            },
          ]);
        }
      })
      .catch(() => setNotification("Something went wrong"));
  };

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
    if (name.length <= 1) {
      setExistingClient([]);
      return;
    }
    const clientsData = getClientsByName(name, clients);
    if (clientsData.length > 5) {
      setExistingClient(clientsData.slice(0, 5));
    } else if (clientsData.length > 0 && clientsData.length <= 5) {
      setExistingClient(getClientsByName(name, clients));
    }
    if (clientsData.length === 0) {
      setExistingClient([]);
    }
  };
  const fetchClientNumber = async (number) => {
    if (number.length <= 1) {
      setExistingClient([]);
      return;
    }
    const clientsData = getClientByNumber(number, clients);
    if (clientsData.length > 5) {
      setExistingClient(clientsData.slice(0, 5));
    } else if (clientsData.length > 0 && clientsData.length <= 5) {
      setExistingClient(getClientByNumber(number, clients));
    }
    if (clientsData.length === 0) {
      setExistingClient([]);
    }
  };

  //submit reservation
  const handleSubmit = (e) => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    e.preventDefault();
    const formattedClientNumber = clientNumber.replace(/\D/g, "");
    const reservation = {
      barber: selectedBarberForm.given_name,
      date: selectedDate.toDateString(),
      slot: selectedSlot,
      service: selectedService,
      fname: clientName.split(" ")[0],
      email: clientEmail,
      number: formattedClientNumber,
      sendSMS: sendSMS,
      sendEmail: sendEmail,
      lname: clientName.split(" ").slice(1).join(" ") || "",
    };
    // https://hollywood-fairmount-admin.onrender.com
    fetch("http://localhost:4000/addReservation", {
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
          reservation._id = data.res_id;
          reservation.client_id = data.client_id;
          setReservations([...reservations, reservation]);
          setNotification("Reservation added successfully");
        }
      })
      .catch(() => setNotification("Something went wrong"));
    setSelectedSlot("");
    setSlotBeforeCheck("");
    setBarber({});
    setClientName("");
    setClientEmail("");
    setClientNumber("");
    setSelectedService("");
    setError(true);
    document.getElementById("clientname").value = "";
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
          } else {
            setEmailError("");
          }
        }
        break;
      case "number":
        setClientNumber(e.target.value);
        if (e.target.value.length > 2) {
          fetchClientNumber(e.target.value);
        }
        if (e.target.value.length === 0) {
          setNumberError("");
        }
        if (numberError === "" && nameError === "") {
          setError(false);
        }
        break;
      case "name":
        setClientName(e.target.value);
        if (e.target.value.length > 2) {
          // If the entered name has more than 3 letters, fetch client data
          fetchClientData(e.target.value);
        }
        if (e.target.value.length <= 2 && e.target.value.length !== 0) {
          setNameError("Name is required");
          setError(true);
          fetchClientData(e.target.value);
        } else if (e.target.value.length === 0) {
          setNameError("Name is required");
          setTimeout(() => {
            setNameError(" ");
          }, 2000);
        } else {
          setNameError("");
          if (numberError === "" && nameError === "") {
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
    setSlotBeforeCheck("");
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
                onChange={(e) => {
                  handleChange(e, e.target.name);
                }}
              ></StyledInput>
              {existingClient.length && (
                <ExistingClientSelect $isMobile={isMobile}>
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
                        key={client.number}
                        onClick={() => {
                          setExistingClient([]);
                          setClientEmail(client.email || "");
                          setClientNumber(client.number);
                          setClientName(client.fname + " " + client.lname);
                          setNameError("");
                          if (
                            !barberError &&
                            !serviceError &&
                            !overLappingError
                          ) {
                            setError(false);
                          }
                          document.getElementById("clientname").value =
                            client.fname + " " + client.lname;
                        }}
                      >
                        {highlightText(
                          `${client.fname} ${client.lname}`,
                          clientName
                        )}{" "}
                        <br />
                        {client.email}
                        <br />
                        {highlightText(`${client.number}`, clientNumber)}
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
                value={clientNumber}
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
          <Book
            style={{ marginLeft: "25%" }}
            key="reminders"
            onClick={(e) => {
              e.preventDefault();
              setShowReminders(!showReminders);
            }}
          >
            Reminders
          </Book>
          {showReminders && <Reminder setShowReminders={setShowReminders} />}
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
            setSlotBeforeCheck={setSlotBeforeCheck}
            slotBeforeCheck={slotBeforeCheck}
            overLappingError={overLappingError}
            setOverLappingError={setOverLappingError}
            setSelectedService={setSelectedService}
          />
          <CheckboxWrapper>
            <div>
              <input
                type="checkbox"
                defaultChecked={sendSMS}
                onClick={() => {
                  setSendSMS(!sendSMS);
                }}
              />
              <label>Send SMS</label>
            </div>
            <div>
              <input
                type="checkbox"
                defaultChecked={sendEmail}
                onClick={() => {
                  setSendEmail(!sendEmail);
                }}
              />
              <label>Send Email</label>
            </div>
          </CheckboxWrapper>
          <Book
            key="reserve"
            type="submit"
            disabled={
              error ||
              barberError ||
              serviceError ||
              overLappingError ||
              nameError === " " ||
              selectedSlot === "" ||
              selectedSlot.length === 0
            }
          >
            Book
          </Book>
          <Book
            key="block"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleBlockSlot(selectedSlot, selectedDate, selectedBarberForm);
            }}
            disabled={
              selectedSlot.length === 0 || selectedSlot === "" || barberError
            }
          >
            Block Slot
          </Book>
        </div>
      </StyledForm>
    </Wrapper>
  );
};
const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin: 20px 0;
  color: whitesmoke;
  width: 30vw;
`;
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
  width: 90vw;
  left: 0;
  bottom: -30%;
`;
const ExistingClientSelect = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  transform: ${(props) =>
    props.$isMobile ? "translateX(-31.5%)" : "translateY(0%)"};
  width: ${(props) => (props.$isMobile ? "80.5vw" : "100%")};
  background-color: #035e3f;
  color: white;
  padding: 10px 0;
  z-index: 100;
`;
const Client = styled.div`
  padding: 10px 0;
  text-align: center;
  transition: 0.3s ease-in-out;
  border-bottom: 1px solid #ccc;
  margin: 0 10px;
  &:hover {
    background-color: #049f6a;
    cursor: pointer;
  }
  &:last-of-type {
    border-bottom: none;
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
