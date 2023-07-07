import {
  LabelInputWrapper,
  StyledLabel,
  Slot,
  SelectedSlotContainer,
  BarberSlot,
} from "../RSVP_Form";
import { useContext, useEffect, useState } from "react";
import { ReservationContext } from "../../contexts/ReservationContext";
import styled from "styled-components";

const SlotSelector = ({
  selectedSlot,
  selectedBarberForm,
  selectedService,
  selectedDate,
  setSelectedSlot,
}) => {
  const { reservations } = useContext(ReservationContext);
  const [availableSlots, setAvailableSlots] = useState([]);

  const formatDate = (date) => {
    const options = { month: "short", weekday: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };
  useEffect(() => {
    if (Object.keys(selectedBarberForm).length === 0) {
      return;
    } else {
      const originalAvailableSlots = selectedBarberForm.availability
        .filter((slot) =>
          slot.slot.includes(handleFormatDateForSlots(selectedDate))
        )
        .map((slot) => {
          if (slot.available === true) {
            return slot.slot;
          } else {
            return "";
          }
        });
      const todayReservations = reservations.filter((reservation) => {
        const today =
          formatDate(new Date(reservation.date)) === formatDate(selectedDate);
        return selectedBarberForm.given_name === reservation.barber && today;
      });
      const filteredSlots = originalAvailableSlots.filter((slot) => {
        return !todayReservations.some((reservation) => {
          return reservation.slot === slot;
        });
      });
      setAvailableSlots(
        filteredSlots.filter((slot) => {
          return slot !== "";
        })
      );
    }
  }, [selectedBarberForm, reservations, selectedDate]);
  const handleFormatDateForSlots = (date) => {
    const options = { weekday: "short" };
    return date.toLocaleDateString(undefined, options);
  };
  return (
    <LabelInputWrapper>
      <StyledLabel>timeSlot:</StyledLabel>
      <SlotContainer>
        {selectedSlot === "" ? (
          <SlotContainer>
            {selectedService !== "" &&
            Object.keys(selectedBarberForm).length !== 0 ? (
              availableSlots.length !== 0 ? (
                availableSlots.map((slot) => {
                  return (
                    <Slot
                      key={slot}
                      onClick={() => {
                        setSelectedSlot(slot);
                      }}
                    >
                      {slot.split("-")[1]}
                    </Slot>
                  );
                })
              ) : (
                <SelectedSlotContainer>
                  <BarberSlot>No slots available</BarberSlot>
                </SelectedSlotContainer>
              )
            ) : (
              <SelectedSlotContainer>
                <SelectedSlot>select barber and service first</SelectedSlot>
              </SelectedSlotContainer>
            )}
          </SlotContainer>
        ) : (
          <SelectedSlotContainer>
            <SelectedSlot
              onClick={() => {
                setSelectedSlot("");
              }}
            >
              {selectedSlot.split("-")[1]}
            </SelectedSlot>
          </SelectedSlotContainer>
        )}
      </SlotContainer>
    </LabelInputWrapper>
  );
};

const SelectedSlot = styled.div`
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: center;
  margin: 5px 5px 0 0;
  transition: 0.3s ease-in-out;
  padding: 5px 0 5px 0;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  width: 20vw;
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
`;
const SlotContainer = styled.div`
  display: grid;
  grid-template-columns: 33% 33% 33% || 100%;
  justify-content: space-evenly;
  align-items: center;
  line-height: 30px;
`;
export default SlotSelector;
