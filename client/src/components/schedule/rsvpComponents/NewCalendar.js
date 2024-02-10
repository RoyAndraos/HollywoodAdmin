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
import "../rsvpComponents/style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import { IsMobileContext } from "../../contexts/IsMobileContext";

const localizer = momentLocalizer(moment);
const NewCalendar = () => {
  const [currentView, setCurrentView] = useState("month");
  const [currentDay, setCurrentDay] = useState(false);
  const navigate = useNavigate();
  const { reservations } = useContext(ReservationContext);
  const { isMobile } = useContext(IsMobileContext);
  const events = reservations.map((reservation) => {
    let time = reservation.slot[0].split("-")[1];
    const toEdit = time.slice(-2);
    const editedTime = editTimeTo24(time, toEdit);
    const editedDate = editDatetoCalendarFormat(reservation.date);
    const constructedDate = `${editedDate}T${editedTime}`;
    const endTime = getEndTime(constructedDate, reservation.service.duration);
    const endTimeDate = new Date(endTime);
    const startTimeDate = new Date(constructedDate);
    return {
      title: reservation.barber,
      service: reservation.service.name,
      day: reservation.date,
      _id: reservation._id,
      start: startTimeDate,
      end: endTimeDate,
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
    navigate(`/schedule/${event._id}`);
  };

  document.addEventListener("DOMContentLoaded", function () {
    const dayViewElements = document.querySelectorAll(
      ".rbc-day-slot .rbc-events-container .rbc-event"
    );
    dayViewElements.forEach((element) => {
      if (element.innerHTML.includes("Ralf")) {
        element.style.left = "50%";
      } else {
        element.style.left = "0%";
      }
    });
    const dayViewColor = document.querySelectorAll(
      ".rbc-day-slot .rbc-events-container .rbc-event .rbc-event-content .event-content-div"
    );
    dayViewColor.forEach((element) => {
      if (element.innerHTML.includes("Ralf")) {
        element.style.backgroundColor = "#70bd70";
      } else {
        element.style.backgroundColor = "green";
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
  });
  useEffect(() => {
    if (isMobile) {
      const monthViewCellButtons =
        document.querySelectorAll(".rbc-button-link ");
      monthViewCellButtons.forEach((element) => {
        element.style.fontSize = "16px";
      });
      const toolbarLabel = document.querySelectorAll(".rbc-toolbar-label");
      const toolbarButton = document.querySelectorAll(".rbc-toolbar button");
      toolbarLabel.forEach((element) => {
        element.style.fontSize = "16px";
      });
      toolbarButton.forEach((element) => {
        element.style.fontSize = "16px";
      });
    }
  }, [isMobile]);

  useEffect(() => {
    const dayViewElements = document.querySelectorAll(
      ".rbc-day-slot .rbc-events-container .rbc-event"
    );
    dayViewElements.forEach((element) => {
      if (element.innerHTML.includes("Ralf")) {
        element.style.left = "50%";
      } else {
        element.style.left = "0%";
      }
    });
    const dayViewColor = document.querySelectorAll(
      ".rbc-day-slot .rbc-events-container .rbc-event .rbc-event-content .event-content-div"
    );
    dayViewColor.forEach((element) => {
      if (element.innerHTML.includes("Ralf")) {
        element.style.backgroundColor = "#70bd70";
      } else {
        element.style.backgroundColor = "green";
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
    if (currentView === "agenda") {
      const agendaDate = document.querySelectorAll(".rbc-toolbar-label");
      const firstDate = agendaDate[0].innerHTML.split("–")[0];
      const lastDate = agendaDate[0].innerHTML.split("–")[1];
      const firstDateObj = new Date(firstDate);
      const lastDateObj = new Date(lastDate);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedFirstDate = firstDateObj.toLocaleDateString(
        "en-US",
        options
      );
      const formattedLastDate = lastDateObj.toLocaleDateString(
        "en-US",
        options
      );
      agendaDate[0].innerHTML = `${formattedFirstDate} - ${formattedLastDate}`;
    }
  }, [currentView, currentDay, isMobile]);

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
  const handleNavigate = () => {
    // Handle navigation events here...
    setCurrentDay(!currentDay); // Update the current view
  };
  return (
    <Wrapper>
      <StyledCalendar
        localizer={localizer}
        events={events}
        views={views}
        onNavigate={handleNavigate}
        startAccessor="start"
        endAccessor="end"
        min={minTime}
        max={maxTime}
        onView={(view) => setCurrentView(view)}
        components={{
          event: CustomEventComponent,
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 85vh;
  z-index: 100;
`;
const StyledCalendar = styled(Calendar)`
  margin: 20px;
  height: 95%;
`;

export default NewCalendar;
