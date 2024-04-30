import { useState, useEffect, useContext } from "react";
import { LabelInfoWrapper, StyledLabel } from "./EditRsvp";
import {
  getEndTimeEditRsvp,
  removeSlotsForOverLapping,
  selectNextSlot,
} from "../../.././helpers";
import { UserContext } from "../../../contexts/UserContext";
import styled from "styled-components";
import moment from "moment";
import { ReservationContext } from "../../../contexts/ReservationContext";

const TimeSlotEdit = ({
  reservation,
  handleChange,
  formData,
  timeEdit,
  setTimeEdit,
  setFormData,
}) => {
  // useState/useContext: timeEdit for inner text of button, barberIsOff, availableSlots, reservations, userInfo(selectedBarber)
  const [barberIsOff, setBarberIsOff] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const { reservations } = useContext(ReservationContext);
  const { userInfo } = useContext(UserContext);
  const selectedService = reservation.service;
  const startTime = formData.slot[0].split("-")[1];
  const [endTime, setEndTime] = useState("");
  // function: format date to "Mon Jan 1"
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const options = { month: "short", weekday: "short", day: "numeric" };
    return dateObj.toLocaleDateString(undefined, options);
  };
  // function: format date to "Mon"
  const handleFormatDateForSlots = (date) => {
    const dateObj = new Date(date);
    const options = { weekday: "short" };
    return dateObj.toLocaleDateString(undefined, options);
  };
  const selectedDate = reservation.date;
  const selectedBarberForm = userInfo.filter((barber) => {
    return barber.given_name.toLowerCase() === reservation.barber.toLowerCase();
  })[0];
  useEffect(() => {
    //if theres no selected barber
    if (Object.keys(selectedBarberForm).length === 0) {
      return;
    } else {
      // if the selected barber is off on the selected date
      if (selectedBarberForm.time_off.length !== 0) {
        const startDate = moment(selectedBarberForm.time_off[0].startDate)._i;
        const endDate = moment(selectedBarberForm.time_off[0].endDate)._i;
        //check if the selected date is between the start and end date of the time off
        const timeOff = moment(selectedDate).isBetween(startDate, endDate);
        //set barberIsOff to true
        setBarberIsOff(timeOff);
      }
      //if the selected barber is not off on the selected date
      //filter the available slots to only show the ones that are open on the selected barber's availability
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

      //check for the barber's reservations on the selected date
      const todayReservations = reservations.filter((reservation) => {
        const today =
          formatDate(new Date(reservation.date)) === formatDate(selectedDate);
        return selectedBarberForm.given_name === reservation.barber && today;
      });
      // filter the reserved slots out of the available slots
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
      const todayReservationStartingSlots = todayReservations.map(
        (reservation) => {
          return reservation.slot[0].split("-")[1];
        }
      );
      const slotsToRemoveForOverlapping = removeSlotsForOverLapping(
        formData.service.duration,
        todayReservationStartingSlots
      );
      const filteredForOverlappingSlots = filteredSlots.filter((slot) => {
        // Extract the time portion of the slot (e.g., "2:30pm")
        const time = slot.split("-")[1];
        // Check if the time is not included in slotsToRemoveForOverlapping
        return !slotsToRemoveForOverlapping.includes(time);
      });

      setAvailableSlots(
        filteredForOverlappingSlots.filter((slot) => {
          return slot !== "";
        })
      );
    }
  }, [
    selectedBarberForm,
    reservations,
    selectedDate,
    selectedService,
    barberIsOff,
    formData.service.duration,
  ]);
  // function: edit inner html of button
  const handleEditClick = () => {
    if (timeEdit === "Edit") {
      setTimeEdit("Show more");
      if (formData.slot.length === 2) {
        handleChange("slot", [reservation.slot[0]]);
      } else if (formData.slot.length === 3) {
        handleChange("slot", [reservation.slot[0], reservation.slot[1]]);
      } else if (formData.slot.length === 4) {
        handleChange("slot", [reservation.slot[0], reservation.slot[1]]);
      }
    } else if (timeEdit === "Show more") {
      setTimeEdit("Cancel");
    } else {
      setFormData({
        ...formData,
        slot: reservation.slot,
      });
      setTimeEdit("Edit");
    }
  };
  const selectSlot = (slot) => {
    switch (formData.service.duration) {
      case "2":
        setFormData({
          ...formData,
          slot: [slot, selectNextSlot(slot)],
        });
        break;
      case "3":
        setFormData({
          ...formData,
          slot: [
            slot,
            selectNextSlot(slot),
            selectNextSlot(selectNextSlot(slot)),
          ],
        });
        break;
      case "4":
        setFormData({
          ...formData,
          slot: [
            slot,
            selectNextSlot(slot),
            selectNextSlot(selectNextSlot(slot)),
            selectNextSlot(selectNextSlot(selectNextSlot(slot))),
          ],
        });
        break;
      default:
        setFormData({
          ...formData,
          slot: [slot],
        });
        break;
    }
  };

  useEffect(() => {
    let endTimeValue = "";
    if (formData.slot.length === 2) {
      const endTimeStart = formData.slot[1].split("-")[1];
      endTimeValue = getEndTimeEditRsvp(endTimeStart);
    } else if (formData.slot.length === 3) {
      const endTimeStart = formData.slot[2].split("-")[1];
      endTimeValue = getEndTimeEditRsvp(endTimeStart);
    } else if (formData.slot.length === 4) {
      const endTimeStart = formData.slot[3].split("-")[1];
      endTimeValue = getEndTimeEditRsvp(endTimeStart);
    }
    setEndTime(endTimeValue);
  }, [formData.slot, endTime]);

  return (
    <LabelInfoWrapper>
      <StyledLabel>Time </StyledLabel>
      {timeEdit === "Edit" &&
        (formData.slot.length === 1 ? (
          <span>{startTime + " - " + getEndTimeEditRsvp(startTime)}</span>
        ) : (
          <span>{startTime + " - " + endTime}</span>
        ))}
      {timeEdit === "Show more" &&
        (formData.slot.length === 1 ? (
          <span key={formData.slot[0]}>
            {formData.slot[0].split("-")[1] +
              " - " +
              getEndTimeEditRsvp(startTime)}
          </span>
        ) : (
          <span key={formData.slot[0]}>
            {formData.slot[0].split("-")[1] + " - " + endTime}
          </span>
        ))}
      {timeEdit === "Cancel" && (
        <SlotSelector>
          {availableSlots.map((slot) => {
            return (
              <Slot
                name="time"
                key={slot}
                onClick={() => {
                  selectSlot(slot);
                  setTimeEdit("Edit");
                }}
              >
                {slot}
              </Slot>
            );
          })}
        </SlotSelector>
      )}
      {timeEdit === "Cancel" && <div></div>}
      <EditButton props={timeEdit} onClick={() => handleEditClick()}>
        {timeEdit}
      </EditButton>
    </LabelInfoWrapper>
  );
};

const EditButton = styled.button`
  height: 35px;
  background-color: #035e3f;
  width: 100px;
  background-color: ${(props) => {
    return props.props === "Cancel" ? " #ad0606" : "#035e3f";
  }};
  color: whitesmoke;
  border-radius: 10px;
  border: none;
  margin-left: 20px;
  transition: 0.3s ease-in-out;
  font-weight: 600;
  position: relative;
  right: ${(props) => {
    return props.props === "Cancel" ? "-20vw" : "";
  }};
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &:active {
    transform: scale(0.95);
  }
`;

const SlotSelector = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: grid;
  grid-template-columns: 32% 32% 32%;
  align-items: center;
  justify-content: space-evenly;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;
const Slot = styled.div`
  text-align: center;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  margin: 0 20px 0 20px;
  padding: 5px 0 5px 0;
  transition: 0.3s ease-in-out;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 10px;
  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
`;
export default TimeSlotEdit;
