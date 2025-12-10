import { useContext, useState } from "react";
import styled from "styled-components";
import { NotificationContext } from "../../contexts/NotficationContext";
const Reminder = ({ setShowReminders }) => {
  const { setNotification } = useContext(NotificationContext);
  const [reservations, setReservations] = useState([]);
  const handleSendReminders = () => {
    //https://hollywood-fairmount-admin.onrender.com
    fetch("https://hollywood-fairmount-admin.onrender.com/sendReminders")
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setReservations(result.reservations);
        setNotification(result.message);
      });
  };

  const handleSendSMS = () => {
    fetch("https://hollywood-fairmount-admin.onrender.com/sendSMSReminders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reservations }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setNotification(result.message);
        setShowReminders(false);
      });
  };

  return (
    <Wrapper>
      {reservations.length > 0 && (
        <Container>
          <Title>{reservations.length} reservations</Title>
          <ResWrapper>
            {reservations.map((res, index) => {
              return (
                <Res key={res._id} $index={index + 1}>
                  <p>{res.fname}</p> <p>{res.date}</p>
                </Res>
              );
            })}
          </ResWrapper>
        </Container>
      )}
      <ButtonWrapper>
        <Button $close={true} onClick={() => setShowReminders(false)}>
          Close
        </Button>
        {reservations.length > 0 ? (
          <Button
            key={"sendSMS"}
            $close={false}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleSendSMS();
            }}
          >
            Send Reminders
          </Button>
        ) : (
          <Button
            key={"getReservations"}
            $close={false}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleSendReminders();
            }}
          >
            Get Reservations
          </Button>
        )}
      </ButtonWrapper>
    </Wrapper>
  );
};
const Title = styled.h2`
  margin: 0;
  text-align: center;
`;
const Container = styled.div`
  background-color: black;
  padding: 50px;
  border-radius: 10px;
`;
const Res = styled.div`
  display: flex;
  justify-content: space-between;
  width: 350px;
  align-items: center;
  padding: 0 15px;
  background-color: ${(props) => (props.$index % 2 === 0 ? "#222" : "#111")};
`;
const ResWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 20px;
  /* Remove default scrollbar track & arrows */
  &::-webkit-scrollbar {
    width: 6px; /* thin bar */
  }

  &::-webkit-scrollbar-button {
    display: none; /* remove up/down arrows */
  }

  /* Remove the background track */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* The actual scroll thumb */
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
  }

  /* Hover effect (optional) */
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;
const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: whitesmoke;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled.button`
  width: 200px;
  background-color: ${(props) => (props.$close ? "#bd0000" : "#4caf50")};
  padding: 10px 0;
  border: none;
  color: whitesmoke;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${(props) => (props.$close ? "#ff0000" : "#77eb7c")};
  }
`;
export default Reminder;
