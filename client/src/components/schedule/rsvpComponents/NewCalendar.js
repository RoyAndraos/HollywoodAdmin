import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  editDatetoCalendarFormat,
  editTimeTo24,
  getEndTime,
} from "../.././helpers";
import { useContext, useEffect, useState } from "react";
import { ReservationContext } from "../.././contexts/ReservationContext";
import { styled } from "styled-components";
// import "react-big-calendar/lib/sass/styles.scss"; // Import main styles
// import "react-big-calendar/lib/addons/dragAndDrop/styles.scss"; // If using DnD
import "../rsvpComponents/style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
const localizer = momentLocalizer(moment);
const NewCalendar = () => {
  const [currentView, setCurrentView] = useState("month");
  const navigate = useNavigate();
  const { reservations } = useContext(ReservationContext);
  // let dayNumberCount = [{}];
  const events = reservations.map((reservation) => {
    let time = reservation.slot[0].split("-")[1];
    const toEdit = time.slice(-2);
    const editedTime = editTimeTo24(time, toEdit);
    const editedDate = editDatetoCalendarFormat(reservation.date);
    const constructedDate = `${editedDate}T${editedTime}`;
    const endTime = getEndTime(constructedDate, reservation.service.duration);
    const endTimeDate = new Date(endTime);
    const startTimeDate = new Date(constructedDate);
    // const dayNunber =
    //   reservation.date.split("")[8] + reservation.date.split("")[9];
    // let found = false;
    // dayNumberCount = dayNumberCount.map((day, index) => {
    //   if (index === 0) {
    //     return day;
    //   } // Skip the first empty object
    //   if (day.dayNumber === dayNunber) {
    //     day.count += 1;
    //     found = true;
    //   }
    //   return day;
    // });
    // if (!found) {
    //   dayNumberCount.push({ dayNumber: dayNunber, count: 1 });
    // }

    return {
      title: reservation.barber,
      service: reservation.service.name,
      day: reservation.date,
      _id: reservation._id,
      start: startTimeDate,
      end: endTimeDate,
    };
  });
  // console.log(dayNumberCount);
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

  useEffect(() => {
    const dayViewElements = document.querySelectorAll(
      ".rbc-day-slot .rbc-events-container .rbc-event"
    );
    dayViewElements.forEach((element) => {
      if (element.innerHTML.includes("Ralf")) {
        element.style.left = "50%";
      }
    });
    const monthViewElements = document.querySelectorAll(
      ".rbc-month-row .rbc-row-content .rbc-row .rbc-row-segment .rbc-event .rbc-event-content .event-content-div "
    );
    monthViewElements.forEach((element) => {
      if (element.innerHTML.includes("Ralf")) {
        element.style.display = "none !important";
      }
    });
  }, [currentView]);

  const CustomEventComponent = ({ event }) => {
    return (
      <div
        onClick={() => handleEventClick(event)}
        className="event-content-div"
      >
        <span>{event.service}</span> <span>{event.title}</span>
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
        onView={(view) => setCurrentView(view)}
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
