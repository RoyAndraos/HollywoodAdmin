import { styled } from "styled-components";
import AddReservation from "./RSVP_Form";
const ControlPanel = () => {
  return (
    <Wrapper>
      <OpenedStuffWrapper>
        <AddReservation />
      </OpenedStuffWrapper>
    </Wrapper>
  );
};

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
export default ControlPanel;
