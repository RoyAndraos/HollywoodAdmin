import { styled } from "styled-components";
import CalendarSchedule from "./CalendarSchedule";
import ControlPanel from "./ControlPanel";
const Schedule = () => {
  return (
    <Wrapper>
      <ControlPanel />
      <CalendarSchedule />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  margin: 20px 20px 0 20px;
  border: 2px solid #033a27;
  padding-bottom: 50px;
  background-color: whitesmoke;
  border-radius: 20px;
  grid-template-columns: 49% 49%;
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 5px;
  }

  /* Styling for Firefox */
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;

  &::-moz-scrollbar-thumb {
    background-color: #888;
    border-radius: 5px;
  }

  &::-moz-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 5px;
  }
`;
export default Schedule;
