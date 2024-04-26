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
const NewCalendar = ({ setSelectedDate, setSlotBeforeCheck }) => {
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
      client: reservation.fname,
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
  maxTime.setHours(19, 0, 0);

  const handleEventClick = (event) => {
    navigate(`/schedule/${event._id}`);
  };

  document.addEventListener("DOMContentLoaded", function () {
    const dayViewElements = document.querySelectorAll(
      ".rbc-day-slot .rbc-events-container .rbc-event"
    );
    dayViewElements.forEach((element) => {
      if (element.innerHTML.includes("Ralph")) {
        element.style.left = "50%";
        element.style.zIndex = "100";
      } else {
        element.style.zIndex = "100";
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
  });

  useEffect(() => {
    const dayViewElements = document.querySelectorAll(
      ".rbc-day-slot .rbc-events-container .rbc-event"
    );
    dayViewElements.forEach((element) => {
      if (element.innerHTML.includes("Ralph")) {
        element.style.width = "50%";
        element.style.zIndex = "100";
        element.style.left = "0%";
      } else {
        element.style.width = "50%";
        element.style.left = "50%";
        element.style.zIndex = "100";
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
  }, [currentView]);
  useEffect(() => {
    const dayViewSlots = document.querySelectorAll(
      ".rbc-day-slot .rbc-timeslot-group .rbc-time-slot"
    );

    const handleClick = (slot) => {
      console.log("clicked");
      const formattedSlot = moment(slot).format("ddd-h:mma");
      setSelectedDate(slot);
      const todayReservations = reservations.filter((reservation) => {
        return reservation.date === moment(slot).format("ddd MMM DD YYYY");
      });
      const slotTaken = todayReservations.some((reservation) => {
        return reservation.slot[0] === formattedSlot;
      });
      if (!slotTaken) {
        setSlotBeforeCheck([formattedSlot]);
        const form = document.getElementById("rsvp");
        form.scrollIntoView({ behavior: "smooth" });
      }
    };

    dayViewSlots.forEach((slot) => {
      slot.style.zIndex = "10";
      const slotDateAndTimeObject =
        Object.values(slot)[0].return.memoizedProps.value;
      slot.removeEventListener("click", handleClick); // Remove previous event listeners
      slot.addEventListener("click", () => handleClick(slotDateAndTimeObject));
    });

    return () => {
      // Cleanup: remove event listeners when component unmounts
      dayViewSlots.forEach((slot) => {
        slot.removeEventListener("click", handleClick);
      });
    };
  }, [reservations, setSelectedDate, setSlotBeforeCheck]);

  const CustomEventComponent = ({ event }) => {
    if (currentView === "month" && isMobile) {
      const monthViewElements = document.querySelectorAll(
        ".rbc-month-view .rbc-event"
      );
      const buttonElement = document.querySelectorAll(".rbc-show-more");
      buttonElement.forEach((element) => {
        element.style.display = "none";
      });

      monthViewElements.forEach((element) => {
        element.style.opacity = "0";
        element.style.zIndex = "-1";
      });
      return;
    }
    const eventTime = moment(event.start).format("h:mm A");
    return (
      <div
        onClick={() => handleEventClick(event)}
        className="event-content-div"
        style={{ zIndex: "101" }}
      >
        {currentView !== "month" && (
          <span>
            <span>{event.client}</span>
            <span style={{ opacity: "0" }}>{event.title}</span>{" "}
            <span>{eventTime}</span>
          </span>
        )}
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
