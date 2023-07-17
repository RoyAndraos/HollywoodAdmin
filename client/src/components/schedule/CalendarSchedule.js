import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { styled } from "styled-components";
import { useContext } from "react";
import { ReservationContext } from "../contexts/ReservationContext";
import { editDatetoCalendarFormat, editTimeTo24, getEndTime } from "../helpers";
const CalendarSchedule = () => {
  const { reservations } = useContext(ReservationContext);

  const events = reservations.map((reservation) => {
    let time = reservation.slot[0].split("-")[1];
    const toEdit = time.slice(-2);
    const editedTime = editTimeTo24(time, toEdit);
    const editedDate = editDatetoCalendarFormat(reservation.date);
    const constructedDate = `${editedDate}T${editedTime}`;
    const endTime = getEndTime(constructedDate, reservation.service.duration);
    const bGColor = reservation.barber === "Ralf" ? "black" : "white";
    return {
      title: reservation.barber,
      start: constructedDate,
      end: endTime,
      backgroundColor: bGColor,
      service: reservation.service.name,
    };
  });

  const eventContent = (arg) => {
    const { event } = arg;
    console.log(event._def.extendedProps.service);
    return (
      <StyledTitle props={event._def.title}>
        <span>{event.title.split("")[0]}.</span>
        {"  "}
        <OtherInfo>{event._def.extendedProps.service}</OtherInfo>
      </StyledTitle>
    );
  };
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
.fc-event {
  border-radius: 10px;
  width:15vw;
  &:hover {
    cursor:pointer;
  }
}
.fc-timegrid-event-harness {
  margin-left:5%;
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
        events={events}
        eventContent={eventContent}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 50px;
  margin-right: 50px;
`;

const StyledTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => {
    return props.props === "Alain" ? "black" : "white";
  }};
  text-align: center;
  font-size: 17px;
`;

const OtherInfo = styled.span`
  font-size: 12px;
`;

export default CalendarSchedule;
