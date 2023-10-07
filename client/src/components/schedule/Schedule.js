import { styled } from "styled-components";
import NewCalendar from "./rsvpComponents/NewCalendar";
import AddReservation from "../schedule/RSVP_Form";
import { useState } from "react";

const Schedule = () => {
  return (
    <div>
      <Wrapper key={"calendar"}>
        <NewCalendar />
      </Wrapper>
      <Wrapper key={"rsvp"} style={{ height: "fit-content" }}>
        <AddReservation />
      </Wrapper>
    </div>
  );
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: whitesmoke;
  height: 87vh;
  &:last-of-type {
    border-radius: 20px;
  }
`;
export default Schedule;
