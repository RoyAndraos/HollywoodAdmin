import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import AddReservation from "./AddReservation";
const ControlPanel = () => {
  const navigate = useNavigate();
  const handleNavToAvailability = (e) => {
    e.preventDefault();
    navigate("/dashboard/availability");
  };

  return (
    <Wrapper>
      <ButtonWrapper>
        <ControlButton onClick={(e) => handleNavToAvailability(e)}>
          Availability
        </ControlButton>
      </ButtonWrapper>
      <OpenedStuffWrapper>
        <AddReservation />
      </OpenedStuffWrapper>
    </Wrapper>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
const OpenedStuffWrapper = styled.div`
  height: 95%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 50px;
  margin-top: 50px;
  position: relative;
`;
const ControlButton = styled.button`
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border: none;
  background-color: #035e3f;
  color: whitesmoke;
  font-size: 20px;
  padding: 10px 15px 10px 15px;
  height: fit-content;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
    background-color: #035e3f;
    color: white;
    transition: all 0.1s ease-in-out;
    transform: scale(1.04);
  }
`;

export default ControlPanel;
