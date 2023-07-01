import {
  LabelInputWrapper,
  StyledLabel,
  Slot,
  SelectedSlotContainer,
} from "../RSVP_Form";
import { useContext } from "react";
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
  const handleFormatDateForSlots = (date) => {
    const options = { weekday: "short" };
    return date.toLocaleDateString(undefined, options);
  };

  console.log(reservations);

  return (
    <LabelInputWrapper>
      <StyledLabel>timeSlot:</StyledLabel>
      <SlotContainer>
        {selectedSlot === "" ? (
          <SlotContainer>
            {Object.keys(selectedBarberForm).length !== 0 &&
            selectedService !== "" ? (
              selectedBarberForm.availability.map((slot) => {
                if (
                  slot.slot.includes(handleFormatDateForSlots(selectedDate))
                ) {
                  return (
                    <Slot
                      key={slot.slot}
                      onClick={() => {
                        setSelectedSlot(slot.slot);
                      }}
                    >
                      {slot.slot.split("-")[1]}
                    </Slot>
                  );
                } else {
                  return null;
                }
              })
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

const SlotContainer = styled.div`
  display: grid;
  grid-template-columns: 33% 33% 33%;
  width: 500px;
  justify-content: space-evenly;
  align-items: center;
  line-height: 30px;
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
export default SlotSelector;
