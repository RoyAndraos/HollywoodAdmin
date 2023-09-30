import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  editDatetoCalendarFormat,
  editTimeTo24,
  getEndTime,
} from "../.././helpers";
import { useContext } from "react";
import { ReservationContext } from "../.././contexts/ReservationContext";
import { styled } from "styled-components";
// import "react-big-calendar/lib/sass/styles.scss"; // Import main styles
// import "react-big-calendar/lib/addons/dragAndDrop/styles.scss"; // If using DnD
import "../rsvpComponents/style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
const localizer = momentLocalizer(moment);
const NewCalendar = () => {
  const navigate = useNavigate();
  const { reservations } = useContext(ReservationContext);
  const events = reservations.map((reservation) => {
    let time = reservation.slot[0].split("-")[1];
    const toEdit = time.slice(-2);
    const editedTime = editTimeTo24(time, toEdit);
    const editedDate = editDatetoCalendarFormat(reservation.date);
    const constructedDate = `${editedDate}T${editedTime}`;
    const endTime = getEndTime(constructedDate, reservation.service.duration);
    return {
      title: reservation.barber,
      service: reservation.service.name,
      _id: reservation._id,
      start: constructedDate,
      end: endTime,
    };
  });
  const views = {
    month: true,
    day: true,
    agenda: true,
  };
  const minTime = new Date();
  minTime.setHours(9, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(21, 0, 0);

  const handleEventClick = (event) => {
    navigate(`/dashboard/schedule/${event._id}`);
  };

  const CustomEventComponent = ({ event }) => {
    return (
      <div onClick={() => handleEventClick(event)}>
        {event.service} {event.title}
      </div>
    );
  };

  return (
    <Wrapper>
      <StyledCalendar
        localizer={localizer}
        events={events}
        views={views}
        startAccessor="start"
        endAccessor="end"
        min={minTime}
        max={maxTime}
        components={{
          event: CustomEventComponent, // Use your custom event component
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 85vh;
`;
const StyledCalendar = styled(Calendar)`
  margin: 20px;
  height: 95%;
`;

export default NewCalendar;
