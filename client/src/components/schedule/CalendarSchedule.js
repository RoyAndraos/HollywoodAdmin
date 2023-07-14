import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { styled } from "styled-components";
import { useContext } from "react";
import { ReservationContext } from "../contexts/ReservationContext";
import {
  editDatetoCalendarFormat,
  editTimeTo24,
  getEndTime,
  customStyles,
} from "../helpers";
const CalendarSchedule = () => {
  const { reservations } = useContext(ReservationContext);

  const events = reservations.map((reservation) => {
    let time = reservation.slot[0].split("-")[1];
    const toEdit = time.slice(-2);
    const editedTime = editTimeTo24(time, toEdit);
    const editedDate = editDatetoCalendarFormat(reservation.date);
    const constructedDate = `${editedDate}T${editedTime}`;
    const endTime = getEndTime(constructedDate, reservation.service.duration);
    return {
      title: reservation.service.name,
      start: constructedDate,
      end: endTime,
    };
  });
  console.log(events);
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
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 50px;
  margin-right: 50px;
`;

export default CalendarSchedule;
