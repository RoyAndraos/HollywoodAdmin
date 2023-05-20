import { styled } from "styled-components";
import CalendarSchedule from "./CalendarSchedule";
import ControlPanel from "./ControlPanel";
const Schedule = () => {
  return (
    <Wrapper>
      <CalendarSchedule />
      <ControlPanel />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
`;

export default Schedule;
