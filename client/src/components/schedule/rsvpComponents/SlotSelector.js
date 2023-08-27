import {
  LabelInputWrapper,
  StyledLabel,
  SelectedSlotContainer,
} from "../RSVP_Form";
import { BarberSlot } from "./BarberSelect";
import { useContext, useEffect, useState } from "react";
import { ReservationContext } from "../../contexts/ReservationContext";
import styled from "styled-components";
import { filterSlotBeforeFor2Duration } from "../../helpers";
import moment from "moment";
const SlotSelector = ({
  selectedSlot,
  selectedBarberForm,
  selectedService,
  selectedDate,
  setSelectedSlot,
}) => {
  const { reservations } = useContext(ReservationContext);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [barberIsOff, setBarberIsOff] = useState(false);
  const formatDate = (date) => {
    const options = { month: "short", weekday: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };
  useEffect(() => {
    if (Object.keys(selectedBarberForm).length === 0) {
      return;
    } else {
      if (selectedBarberForm.time_off.length !== 0) {
        const startDate = moment(selectedBarberForm.time_off[0].startDate)._i;
        const endDate = moment(selectedBarberForm.time_off[0].endDate)._i;
        const timeOff = moment(selectedDate).isBetween(startDate, endDate);
        setBarberIsOff(timeOff);
      }
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
          if (reservation.slot.length === 1) {
            return reservation.slot[0] === slot;
          } else {
            return reservation.slot[0] === slot || reservation.slot[1] === slot;
          }
        });
      });

      if (selectedService.duration === "2") {
        const removedBeforeSlotsFor2Duration = todayReservations.map(
          (reservation) => {
            return filterSlotBeforeFor2Duration(reservation.slot[0]);
          }
        );
        setAvailableSlots(
          filteredSlots
            .filter((slot) => {
              return slot !== "";
            })
            .filter((item) => !removedBeforeSlotsFor2Duration.includes(item))
        );
      } else {
        setAvailableSlots(
          filteredSlots.filter((slot) => {
            return slot !== "";
          })
        );
      }
    }
  }, [
    selectedBarberForm,
    reservations,
    selectedDate,
    selectedService,
    barberIsOff,
  ]);

  const handleFormatDateForSlots = (date) => {
    const options = { weekday: "short" };
    return date.toLocaleDateString(undefined, options);
  };
  return (
    <LabelInputWrapper>
      <StyledLabel>Time Slot</StyledLabel>
      <SlotContainer>
        {selectedSlot.length === 0 ? (
          <SlotContainer>
            {selectedService !== "" &&
            Object.keys(selectedBarberForm).length !== 0 ? (
              availableSlots.length !== 0 && !barberIsOff ? (
                availableSlots.map((slot) => {
                  return (
                    <Slot
                      key={slot}
                      onClick={() => {
                        setSelectedSlot([slot]);
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
                setSelectedSlot([]);
              }}
            >
              {selectedSlot[0].split("-")[1]}
            </SelectedSlot>
          </SelectedSlotContainer>
        )}
      </SlotContainer>
    </LabelInputWrapper>
  );
};
const SlotAvail = styled.div`
  width: 10vw;
`;
const SelectedSlot = styled.div`
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: center;
  margin: 5px 5px 0 0;
  transition: 0.3s ease-in-out;
  padding: 5px 0 5px 0;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  width: 30vw;
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
`;
const SlotContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 30vw;
  justify-content: space-evenly;
  line-height: 30px;
`;

export const Slot = styled.div`
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: center;
  margin: 5px 5px 0 0;
  transition: 0.3s ease-in-out;
  width: 6vw;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
`;
export default SlotSelector;
