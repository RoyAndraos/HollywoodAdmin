import React, { useContext } from "react";
import styled from "styled-components";
import { ReservationContext } from "../../contexts/ReservationContext";

const Reminder = ({ setShowReminderModal }) => {
  const { reservations } = useContext(ReservationContext);
  const tomorrowReservations = reservations.filter((reservation) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const reservationDate = new Date(reservation.date);
    return (
      reservationDate.getDate() === tomorrow.getDate() &&
      reservationDate.getMonth() === tomorrow.getMonth() &&
      reservationDate.getFullYear() === tomorrow.getFullYear()
    );
  });
  return (
    <Wrapper>
      {tomorrowReservations.length > 0 ? (
        <SmolWrapper>
          <h1>Reminder SMS</h1>
          <AllResiesWrapper>
            {tomorrowReservations.map((reservation) => (
              <Res key={reservation._id}>
                <label>
                  {reservation.fname} {reservation.lname} at{" "}
                  {reservation.slot[0].split("-")[1]}
                </label>
                <CheckBox type="checkbox" defaultChecked />
              </Res>
            ))}
          </AllResiesWrapper>
          <ButtonWrapper>
            <Button $close={true} onClick={() => setShowReminderModal(false)}>
              Close
            </Button>
            <Button $close={false} disabled={true}>
              Send
            </Button>
          </ButtonWrapper>
        </SmolWrapper>
      ) : (
        <SmolWrapper>
          <h1>Reminder SMS</h1>
          <p>You have no reservations tomorrow</p>
          <ButtonWrapper>
            <Button onClick={() => setShowReminderModal(false)}>Close</Button>
            <Button disabled={true}>Send</Button>
          </ButtonWrapper>
        </SmolWrapper>
      )}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;
const SmolWrapper = styled.div`
  position: fixed;
  width: 50%;
  min-height: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const AllResiesWrapper = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 50%;
  overflow-y: auto;
`;

const Res = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid black;
  padding: 5px 15px;
`;
const CheckBox = styled.input`
  width: 15px;
  height: 15px;
  cursor: pointer;
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
`;

const Button = styled.button`
  width: 100px;
  background-color: ${(props) => (props.$close ? "#bd0000" : "#4caf50")};
  padding: 10px 0;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${(props) => (props.$close ? "#ff0000" : "#77eb7c")};
  }
`;
export default Reminder;
