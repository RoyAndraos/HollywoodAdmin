import { useState, useEffect, useContext } from "react";
import { LabelInfoWrapper, StyledLabel } from "./EditRsvp";
import {
  getEndTimeEditRsvp,
  filterSlotBeforeFor2Duration,
} from "../../.././helpers";
import { UserContext } from "../../../contexts/UserContext";
import styled from "styled-components";
import moment from "moment";
import { ReservationContext } from "../../../contexts/ReservationContext";

const TimeSlotEdit = ({ reservation, handleChange, formData }) => {
  const [timeEdit, setTimeEdit] = useState("Edit");
  const [barberIsOff, setBarberIsOff] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const { reservations } = useContext(ReservationContext);
  const { userInfo } = useContext(UserContext);
  const selectedService = reservation.service;
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const options = { month: "short", weekday: "short", day: "numeric" };
    return dateObj.toLocaleDateString(undefined, options);
  };
  const handleFormatDateForSlots = (date) => {
    const dateObj = new Date(date);
    const options = { weekday: "short" };
    return dateObj.toLocaleDateString(undefined, options);
  };
  const selectedDate = reservation.date;
  const selectedBarberForm = userInfo.filter(
    (barber) => barber.given_name === reservation.barber
  )[0];
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
  const handleEditClick = () => {
    if (timeEdit === "Edit") {
      setTimeEdit("Show more");
      handleChange("slot", [reservation.slot[0]]);
    } else if (timeEdit === "Show more") {
      setTimeEdit("Cancel");
    } else {
      handleChange("slot", reservation.slot);
      setTimeEdit("Edit");
    }
  };
  const startTime = formData.slot[0].split("-")[1];
  let endTime = "";
  if (formData.slot.length === 2) {
    const endTimeStart = formData.slot[1].split("-")[1];
    endTime = getEndTimeEditRsvp(endTimeStart);
  }

  return (
    <LabelInfoWrapper>
      <StyledLabel>Time: </StyledLabel>
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
            {formData.slot[0].split("-")[1] +
              " - " +
              getEndTimeEditRsvp(startTime)}
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
                  handleChange("slot", [slot]);
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
