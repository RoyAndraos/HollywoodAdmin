import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { styled } from "styled-components";
import { useContext, useEffect, useState } from "react";
import { ReservationContext } from "./ReservationContext";
// #035e3f0
const CalendarSchedule = () => {
  const { reservations } = useContext(ReservationContext);
  console.log(reservations);
  const customStyles = `
  .fc-scroller.fc-scroller-liquid-absolute::-webkit-scrollbar {
    display: none;
  }
  .fc-button-primary{
    background-color: #035e3f;
  }
  .fc{
    font-family: 'Brandon Grotesque regular', sans-serif;
    min-height: 76vh;
    font-weight:600;
    overflow:hidden;
  }
  .fc-scrollgrid {
    border: 2px solid #2c3e50 !important;
  }
  .fc-col-header {
    background-color: #035e3f;
  }
  .fc-col-header-cell-cushion{
    color:white;
  }
  .fc-day {
    border: 2px solid #2c3e50 !important;
    color:black;
  }
  .fc-toolbar-title {
    font-family: 'Brandon Grotesque regular', sans-serif;
  }
  .fc-toolbar .fc-button-group  button {
    background-color: #035e3f;
    color: white; 
    border:none;
  }
  .fc-toolbar .fc-button-group  button:hover {
    background-color: #035e3f;
    color: white; 
      transition: all 0.1s ease-in-out;
    transform:scale(1.04)
  }
  .fc-timeGridDay-button.fc-button.fc-button-primary.fc-button-active {
    background-color: transparent;
    color: black;
    font-weight: 600;
    transform:scale(.96)
    transition: all 0.1s ease-in-out;
    border:2px solid black;
    border-left:none;
  }
  .fc-timeGridWeek-button.fc-button.fc-button-primary.fc-button-active {
    background-color: transparent;
    color: black;
    font-weight: 600;
    transform:scale(.96)
    transition: all 0.1s ease-in-out;
    border:2px solid black;
    border-left:none;
    border-right:none;
  }
  .fc-dayGridMonth-button.fc-button.fc-button-primary.fc-button-active {
    background-color: transparent;
    color: black;
    font-weight: 600;
    transform:scale(.96)
    transition: all 0.1s ease-in-out;
    border:2px solid black;
    border-right:none;
  }
  .fc-today-button.fc-button.fc-button-primary {
    background-color:#035e3f ;
  }
  .fc-today-button.fc-button.fc-button-primary:hover {
    cursor:pointer;
  }
    `;

  return (
    <Wrapper>
      <style>{customStyles}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        slotMinTime="09:00:00"
        slotMaxTime="21:00:00"
        initialView="timeGridDay"
        // events={}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 50px;
  margin-right: 50px;
`;

export default CalendarSchedule;
