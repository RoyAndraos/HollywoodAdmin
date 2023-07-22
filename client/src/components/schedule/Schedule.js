import { styled } from "styled-components";
import CalendarSchedule from "./CalendarSchedule";
import NewCalendar from "./rsvpComponents/NewCalendar";
import AddReservation from "./RSVP_Form";
import Columns from "./rsvpComponents/Columns";
import { useState } from "react";
const Schedule = () => {
  const [currentView, setCurrentView] = useState("month"); // Add state for the current view
  return (
    <Wrapper>
      {/* <CalendarSchedule /> */}
      {currentView === "day" && <Columns />}

      <NewCalendar setCurrentView={setCurrentView} />
      <AddReservation />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 20px 0 20px;
  border: 2px solid #033a27;
  height: fit-content;
  background-color: whitesmoke;
  border-radius: 20px;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;
export default Schedule;
