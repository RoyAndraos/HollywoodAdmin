import {
  LabelInputWrapper,
  StyledLabel,
  SelectedSlotContainer,
} from "../RSVP_Form";
import { BarberSlot } from "./BarberSelect";
import { useContext, useEffect, useState } from "react";
import { ReservationContext } from "../../contexts/ReservationContext";
import styled from "styled-components";
import { removeSlotsForOverLapping, selectNextSlot } from "../../helpers";
import { ServicesContext } from "../../contexts/ServicesContext";
import { EmployeeServicesContext } from "../../contexts/EmployeeServicesContext";
import moment from "moment";
const SlotSelector = ({
  selectedBarberForm,
  selectedService,
  selectedDate,
  setSelectedSlot,
  slotBeforeCheck,
  setSlotBeforeCheck,
  overLappingError,
  setOverLappingError,
  setSelectedService,
}) => {
  const { reservations } = useContext(ReservationContext);
  const { services } = useContext(ServicesContext);
  const { servicesEmp } = useContext(EmployeeServicesContext);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [barberIsOff, setBarberIsOff] = useState(false);
  const todayDate = new Date();
  // format date for Wed Mar 27 2024
  const formattedDate = moment(todayDate).format("ddd MMM DD YYYY").toString();
  const isToday =
    formattedDate ===
    moment(selectedDate).format("ddd MMM DD YYYY").toString().slice(0, 15);
  const formatDate = (date) => {
    const options = { month: "short", weekday: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };
  useEffect(() => {
    if (Object.keys(selectedBarberForm).length === 0) {
      //if no barber is selected
      return;
    } else {
      //check if barber is off
      if (selectedBarberForm.time_off.length !== 0) {
        const startDate = moment(selectedBarberForm.time_off[0].startDate)._i;
        const endDate = moment(selectedBarberForm.time_off[0].endDate)._i;
        const timeOff = moment(selectedDate).isBetween(startDate, endDate);
        setBarberIsOff(timeOff);
      }
      // if barber is not off, filter available slots of the selected day
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
      //get reserved slots of the selected day
      const todayReservations = reservations.filter((reservation) => {
        const today =
          formatDate(new Date(reservation.date)) === formatDate(selectedDate);
        return selectedBarberForm.given_name === reservation.barber && today;
      });
      //filter reserved slots for the selected day for the selected barber out
      const filteredSlots = originalAvailableSlots.filter((slot) => {
        return !todayReservations.some((reservation) => {
          if (reservation.slot.length === 1) {
            return reservation.slot[0] === slot;
          } else if (reservation.slot.length === 2) {
            return reservation.slot[0] === slot || reservation.slot[1] === slot;
          } else if (reservation.slot.length === 3) {
            return (
              reservation.slot[0] === slot ||
              reservation.slot[1] === slot ||
              reservation.slot[2] === slot
            );
          } else {
            return (
              reservation.slot[0] === slot ||
              reservation.slot[1] === slot ||
              reservation.slot[2] === slot ||
              reservation.slot[3] === slot
            );
          }
        });
      });
      const todayReservedStartingSlots = todayReservations.map(
        (reservation) => {
          return reservation.slot[0].split("-")[1];
        }
      );

      //select the right services array based on the selected Barber
      if (selectedService !== "") {
        const selectedServiceArray =
          selectedBarberForm.given_name === "Ralph" ? services : servicesEmp;
        setSelectedService(
          selectedServiceArray.find((service) => {
            return service._id === selectedService._id;
          })
        );
      }

      const slotsToRemoveForOverlapping = removeSlotsForOverLapping(
        selectedService.duration,
        todayReservedStartingSlots
      );
      const filteredForOverlappingSlots = filteredSlots.filter((slot) => {
        // Extract the time portion of the slot (e.g., "2:30pm")
        const time = slot.split("-")[1];
        // Check if the time is not included in slotsToRemoveForOverlapping
        return !slotsToRemoveForOverlapping.includes(time);
      });
      //filter out the dailyAvailability slots
      if (isToday) {
        const dailyAvailabilityFilteredSlots =
          selectedBarberForm.dailyAvailability
            .filter((slot) => {
              return slot.available === false;
            })
            .map((slot) => {
              return slot.slot;
            });

        setAvailableSlots(
          filteredForOverlappingSlots
            .filter((slot) => {
              return slot !== "";
            })
            .filter((item) => {
              return !dailyAvailabilityFilteredSlots.some((slot) =>
                item.includes(slot)
              );
            })
        );
      } else {
        setAvailableSlots(
          filteredForOverlappingSlots.filter((slot) => {
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
    setSelectedService,
    barberIsOff,
    isToday,
    services,
    servicesEmp,
  ]);
  //check if selected slot will overlap with the reserved slots
  useEffect(() => {
    //select right service depending on the selected barber
    let newSlotArray = [];
    if (slotBeforeCheck.length === 0 || selectedService === "") {
      return;
    } else {
      const selectedServiceArray =
        selectedBarberForm.given_name === "Ralph" ? services : servicesEmp;
      const finalSelectedService = selectedServiceArray.find((service) => {
        return service._id === selectedService._id;
      });
      const selectedServiceDuration = finalSelectedService.duration;

      if (selectedServiceDuration === "1") {
      } else if (selectedServiceDuration === "2") {
        newSlotArray = [...slotBeforeCheck, selectNextSlot(slotBeforeCheck[0])];
      } else if (selectedServiceDuration === "3") {
        newSlotArray = [
          ...slotBeforeCheck,
          selectNextSlot(slotBeforeCheck[0]),
          selectNextSlot(selectNextSlot(slotBeforeCheck[0])),
        ];
      } else if (selectedServiceDuration === "4") {
        newSlotArray = [
          ...slotBeforeCheck,
          selectNextSlot(slotBeforeCheck[0]),
          selectNextSlot(selectNextSlot(slotBeforeCheck[0])),
          selectNextSlot(selectNextSlot(selectNextSlot(slotBeforeCheck[0]))),
        ];
      }
      const todayReservations = reservations.filter((reservation) => {
        const today =
          formatDate(new Date(reservation.date)) === formatDate(selectedDate);
        return selectedBarberForm.given_name === reservation.barber && today;
      });
      const todayReservedStartingSlots = todayReservations.map(
        (reservation) => {
          return reservation.slot[0].split("-")[1];
        }
      );
      const slotsToRemoveForOverlapping = removeSlotsForOverLapping(
        selectedServiceDuration,
        todayReservedStartingSlots
      );
      const newSlotArrayStartTime = newSlotArray.slice(0, 1);
      const filteredForOverlappingSlots = newSlotArrayStartTime.filter(
        (slot) => {
          // Extract the time portion of the slot (e.g., "2:30pm")
          const time = slot.split("-")[1];
          // Check if the time is not included in slotsToRemoveForOverlapping
          return slotsToRemoveForOverlapping.includes(time);
        }
      );
      if (filteredForOverlappingSlots.length !== 0) {
        setOverLappingError(true);
      } else {
        setSelectedSlot(newSlotArray);
        setOverLappingError(false);
      }
    }
  }, [
    selectedService,
    slotBeforeCheck,
    selectedBarberForm,
    selectedDate,
    reservations,
    setSelectedSlot,
    setOverLappingError,
    services,
    servicesEmp,
  ]);

  const handleFormatDateForSlots = (date) => {
    const options = { weekday: "short" };
    return date.toLocaleDateString(undefined, options);
  };
  return (
    <LabelInputWrapper>
      <StyledLabel>Time Slot</StyledLabel>
      {selectedService.length !== 0 ? (
        <SlotContainer>
          {slotBeforeCheck.length === 0 ? (
            <SlotContainer>
              {availableSlots.length !== 0 && !barberIsOff ? (
                availableSlots.map((slot) => {
                  return (
                    <Slot
                      key={slot}
                      onClick={() => {
                        setSlotBeforeCheck([slot]);
                      }}
                    >
                      {slot.split("-")[1]}
                    </Slot>
                  );
                })
              ) : (
                <SelectedSlotContainer>
                  <BarberSlot>Barber Is Off</BarberSlot>
                </SelectedSlotContainer>
              )}
            </SlotContainer>
          ) : (
            <SelectedSlotContainer>
              <SelectedSlot
                onClick={() => {
                  setSlotBeforeCheck([]);
                  setOverLappingError(false);
                  setSelectedSlot([]);
                }}
                style={{
                  background: "#035e3f",
                  border: "transparent solid 1px",
                  color: "whitesmoke",
                }}
              >
                {slotBeforeCheck[0].split("-")[1]}
              </SelectedSlot>
            </SelectedSlotContainer>
          )}
        </SlotContainer>
      ) : (
        <SelectedSlotContainer>
          <BarberSlot>
            Select Service
            {Object.keys(selectedBarberForm).length === 0
              ? ", Select Barber"
              : ""}
          </BarberSlot>
        </SelectedSlotContainer>
      )}
      {overLappingError && (
        <OverlapError>
          Time slot chosen will overlap with another reservation
        </OverlapError>
      )}
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
  width: 30vw;
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
  @media (max-width: 768px) {
    width: 80vw;
  }
`;
const SlotContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 30vw;
  justify-content: space-evenly;
  line-height: 30px;
  @media (max-width: 768px) {
    width: 80vw;
  }
`;

export const Slot = styled.div`
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: center;
  margin: 5px 5px 0 0;
  transition: 0.3s ease-in-out;
  width: 6vw;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  font-size: clamp(16px, 18px, 22px);
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
  @media (max-width: 768px) {
    width: 20vw;
    font-size: 16px;
  }
`;
const OverlapError = styled.div`
  color: red;
  font-size: 16px;
  margin-top: 5px;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
export default SlotSelector;
