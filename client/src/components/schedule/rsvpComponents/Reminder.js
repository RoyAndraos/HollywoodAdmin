import { useContext } from "react";
import styled from "styled-components";
import { NotificationContext } from "../../contexts/NotficationContext";
const Reminder = ({ setShowReminders }) => {
  const { setNotification } = useContext(NotificationContext);
  const handleSendReminders = () => {
    //https://hollywood-fairmount-admin.onrender.com
    fetch("https://hollywood-fairmount-admin.onrender.com/sendReminders")
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setShowReminders(false);
        setNotification(result.message);
      });
  };
  return (
    <Wrapper>
      Are you sure?
      <ButtonWrapper>
        <Button $close={true} onClick={() => setShowReminders(false)}>
          Close
        </Button>
        <Button
          key={"sendSMS"}
          $close={false}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleSendReminders();
          }}
        >
          Send
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};
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
  width: 100px;
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
