import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { ReservationContext } from "../../contexts/ReservationContext";
import moment from "moment";
const Reminder = ({ setShowReminders }) => {
  const { reservations } = useContext(ReservationContext);
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [tomorrowReservations] = useState(
    reservations.filter((reservation) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const reservationDate = new Date(reservation.date);
      return (
        reservationDate.getDate() === tomorrow.getDate() &&
        reservationDate.getMonth() === tomorrow.getMonth() &&
        reservationDate.getFullYear() === tomorrow.getFullYear()
      );
    })
  );
  const sortedReservations = tomorrowReservations.sort((a, b) => {
    //convert to 24hr time
    const aTime = moment(a.slot[0].split("-")[1], "hh:mm A");
    const bTime = moment(b.slot[0].split("-")[1], "hh:mm A");

    return aTime.diff(bTime);
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const sendSMS = () => {
    selectedReservations.forEach((reservation) => {
      const message = `Hello ${
        reservation.fname
      }, this is a reminder for your appointment tomorrow at ${
        reservation.slot[0].split("-")[1]
      }. Thank you for choosing hollywood fairmount barbers!`;
      fetch("https://hollywood-fairmount-admin.onrender.com/sendReminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: reservation.number,
          message,
        }),
      });
    });
    setShowReminders(false);
  };
  useEffect(() => {
    setSelectedReservations(tomorrowReservations);
  }, [reservations, tomorrowReservations]);
  return (
    <Wrapper>
      {tomorrowReservations.length > 0 ? (
        <SmolWrapper>
          <h1>Reminder SMS for {moment(tomorrow).format("MMMM DD")} </h1>
          <AllResiesWrapper>
            {sortedReservations.map((reservation) => (
              <Res key={reservation._id}>
                <label>
                  {reservation.fname} {reservation.lname} at{" "}
                  {reservation.slot[0].split("-")[1]}
                </label>
                <CheckBox
                  type="checkbox"
                  defaultChecked
                  onClick={() => {
                    if (
                      selectedReservations.find((res) => {
                        return res._id === reservation._id;
                      })
                    ) {
                      setSelectedReservations((prev) => {
                        return prev.filter(
                          (res) => res._id !== reservation._id
                        );
                      });
                    } else {
                      setSelectedReservations((prev) => [...prev, reservation]);
                    }
                  }}
                />
              </Res>
            ))}
          </AllResiesWrapper>
          <ButtonWrapper>
            <Button $close={true} onClick={() => setShowReminders(false)}>
              Close
            </Button>
            <Button
              key={"sendSMS"}
              $close={false}
              disabled={selectedReservations.length === 0}
              onClick={() => {
                sendSMS();
              }}
            >
              Send
            </Button>
          </ButtonWrapper>
        </SmolWrapper>
      ) : (
        <SmolWrapper>
          <h1>Reminder SMS</h1>
          <p>You have no reservations tomorrow</p>
          <ButtonWrapper>
            <Button onClick={() => setShowReminders(false)} $close={true}>
              Close
            </Button>
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
  max-height: 55%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 30px 0;
`;

const AllResiesWrapper = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 50%;
  overflow-y: auto;
  border: 1px solid #4caf50;
  padding: 10px;
`;

const Res = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid black;
  padding: 5px 15px;
`;
const CheckBox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-top: 20px;
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
