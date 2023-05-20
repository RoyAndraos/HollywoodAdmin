import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { styled } from "styled-components";
const events = [
  {
    title: "Meeting",
    start: new Date(),
  },
];
const CalendarSchedule = () => {
  const customStyles = `
  .fc{
    height: 50vh;
  }
    .fc-scrollgrid {
      border: 2px solid #2c3e50 !important;
    }
    .fc-col-header {
      background-color: #2c3e50;
    }
    .fc-col-header-cell-cushion{
      color:white;
    }
    .fc-day {
       border: 2px solid #2c3e50 !important;
       color:black;
       transition: all 0.3s ease-in-out;
       &:hover {
         cursor:pointer;
         background-color:rgba(0,0,0,0.1)
       }
     }
       .fc-toolbar-title {
         font-family: 'Brandon Grotesque Light', sans-serif;
       }
       .fc-scrollgrid-section-header {
        background-color: grey;
       }
       .fc-button-group{
          transition: all 0.3s ease-in-out;
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
        initialView="timeGridDay"
        events={events}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 50px;
  margin-left: 50px;
`;

export default CalendarSchedule;
