import { styled } from "styled-components";
import NewCalendar from "./rsvpComponents/NewCalendar";
import AddReservation from "../schedule/RSVP_Form";
// import Columns from "./rsvpComponents/Columns";
import { useState } from "react";

const Schedule = () => {
  const [currentView, setCurrentView] = useState("month"); // Add state for the current view
  return (
    <div>
      <Wrapper key={"calendar"}>
        {/* <CalendarSchedule /> */}
        {/* {currentView === "day" && <Columns />} */}
        <NewCalendar
          setCurrentView={setCurrentView}
          currentView={currentView}
        />
      </Wrapper>
      <Wrapper key={"rsvp"}>
        <AddReservation />
      </Wrapper>
    </div>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 20px 30px 20px;
  border: 2px solid #033a27;
  background-color: whitesmoke;
  border-radius: 20px;
  height: 89vh;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;
export default Schedule;
