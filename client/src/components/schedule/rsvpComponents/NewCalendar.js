import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  editDatetoCalendarFormat,
  editTimeTo24,
  getEndTime,
} from "../../helpers";
import { useContext, useEffect, useState, useCallback } from "react";

import { styled } from "styled-components";
import "../rsvpComponents/style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import { IsMobileContext } from "../../contexts/IsMobileContext";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import HoveredEvent from "./HoveredEvent";
import { NotificationContext } from "../../contexts/NotficationContext";
import Loader from "../../Loader";
import Cookies from "js-cookie";

const localizer = momentLocalizer(moment);

const NewCalendar = ({
  setSelectedDate,
  setSlotBeforeCheck,
  reservations,
  currentView,
  currentDay,
  loading,
  setCurrentView,
  setCurrentDay,
  savedView,
  savedDay,
  setBlockedSlots,
  blockedSlots,
}) => {
  const [showDeleteBlockedModal, setShowDeleteBlockedModal] = useState(false);
  const [selectedBlockedSlot, setSelectedBlockedSlot] = useState("");
  const navigate = useNavigate();
  const { isMobile } = useContext(IsMobileContext);
  const { setNotification } = useContext(NotificationContext);
  const role = Cookies.get("role");
  let filteredReservations = [...reservations];
  let filteredBlockedSlots = [];
  if (blockedSlots.length !== 0) {
    filteredBlockedSlots = [...blockedSlots];
  }
  if (role === "jordi") {
    filteredBlockedSlots = filteredBlockedSlots.filter((slot) => {
      return slot.barber === "Jordi";
    });
    filteredReservations = filteredReservations.filter((reservation) => {
      return reservation.barber === "Jordi";
    });
  } else if (role === "ralf") {
    filteredBlockedSlots = filteredBlockedSlots.filter((slot) => {
      return slot.barber === "ralf";
    });
    filteredReservations = filteredReservations.filter((reservation) => {
      return reservation.barber === "ralf";
    });
  }
  const blockedEvents = filteredBlockedSlots.map((slot) => {
    let time = slot.slot[0].split("-")[1];
    const toEdit = time.slice(-2);
    const editedTime = editTimeTo24(time, toEdit);
    const editedDate = editDatetoCalendarFormat(slot.date);
    const constructedDate = `${editedDate}T${editedTime}`;
    const endTime = getEndTime(constructedDate, slot.slot.length.toString());
    const endTimeDate = new Date(endTime);
    const startTimeDate = new Date(constructedDate);

    return {
      title: slot.barber,
      client: "Blocked",
      service: "Blocked",
      day: slot.date,
      start: startTimeDate,
      end: endTimeDate,
      _id: slot._id,
    };
  });

  const events = filteredReservations
    .map((reservation) => {
      let time = reservation.slot[0].split("-")[1];
      const toEdit = time.slice(-2);
      const editedTime = editTimeTo24(time, toEdit);
      const editedDate = editDatetoCalendarFormat(reservation.date);
      const constructedDate = `${editedDate}T${editedTime}`;
      const endTime = getEndTime(
        constructedDate,
        reservation.slot.length.toString()
      );
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
        client_id: reservation.client_id,
      };
    })
    .concat(blockedEvents);
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
    if (event.client === "Blocked") {
      setShowDeleteBlockedModal(true);
      setSelectedBlockedSlot(event);
      return;
    }
    navigate(`/schedule/${event._id}`);
  };

  const applyStyles = useCallback(() => {
    setTimeout(() => {
      const dayViewElements = document.querySelectorAll(
        ".rbc-day-slot .rbc-events-container .rbc-event"
      );
      if (role === "admin") {
        dayViewElements.forEach((element) => {
          if (element.innerHTML.includes("Ralph")) {
            element.style.width = "50%";
            element.style.zIndex = "100";
            element.style.left = "0%";
            element.style.backgroundColor = "#035e3f";
            element.style.borderBottom = "1px solid white";
            element.style.transition = "0.3s ease-in-out";
          } else {
            element.style.width = "50%";
            element.style.left = "50%";
            element.style.zIndex = "100";
            element.style.backgroundColor = "#e53939";
            element.style.borderBottom = "1px solid white";
            element.style.transition = "0.3s ease-in-out";
          }
        });
      } else {
        if (role === "jordi") {
          dayViewElements.forEach((element) => {
            element.style.width = "99%";
            element.style.left = "0.5%";
            element.style.backgroundColor = "#e53939";
            element.style.zIndex = "100";
            element.style.borderBottom = "1px solid white";
            element.style.transition = "0.3s ease-in-out";
          });
        } else {
          dayViewElements.forEach((element) => {
            element.style.width = "99%";
            element.style.left = "0.5%";
            element.style.backgroundColor = "#e539a1";
            element.style.zIndex = "100";
            element.style.borderBottom = "1px solid white";
            element.style.transition = "0.3s ease-in-out";
          });
        }
      }

      if (currentView === "agenda") {
        const agendaDate = document.querySelectorAll(".rbc-toolbar-label");
        if (agendaDate.length > 0) {
          const [firstDate, lastDate] = agendaDate[0].innerHTML.split("–");
          const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
          };
          const formattedFirstDate = new Date(firstDate).toLocaleDateString(
            "en-US",
            options
          );
          const formattedLastDate = new Date(lastDate).toLocaleDateString(
            "en-US",
            options
          );
          agendaDate[0].innerHTML = `${formattedFirstDate} - ${formattedLastDate}`;
        }
      }
    }, 300); // Delay to ensure DOM is fully rendered
  }, [currentView, role]);

  useEffect(() => {
    const handleDebouncedApplyStyles = () => {
      applyStyles();
    };
    const timer = setTimeout(handleDebouncedApplyStyles, 300);
    return () => clearTimeout(timer);
  }, [currentView, currentDay, reservations, applyStyles]);

  useEffect(() => {
    const dayViewSlots = document.querySelectorAll(
      ".rbc-day-slot .rbc-timeslot-group .rbc-time-slot"
    );

    const handleClick = (slot) => {
      const todayDate = document.querySelector(".rbc-toolbar-label");
      const thisYear = new Date().getFullYear();
      setSelectedDate(new Date(todayDate.innerHTML + " " + thisYear));
      const formattedSlot =
        todayDate.innerHTML.slice(0, 3) + "-" + moment(slot).format("h:mma");

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
      dayViewSlots.forEach((slot) => {
        slot.removeEventListener("click", handleClick);
      });
    };
  }, [
    reservations,
    setSelectedDate,
    setSlotBeforeCheck,
    currentView,
    currentDay,
  ]);

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
    } else if (currentView === "day" && isMobile) {
      const dayViewElementLabels = document.querySelectorAll(
        ".rbc-day-slot .rbc-events-container .rbc-event .rbc-event-label"
      );
      dayViewElementLabels.forEach((element) => {
        element.style.display = "none";
      });
    }
    return (
      <>
        {loading ? (
          <div></div>
        ) : (
          <div
            onClick={() => handleEventClick(event)}
            className="event-content-div"
            style={{ zIndex: "101" }}
          >
            {currentView !== "month" && (
              <Tippy
                content={<HoveredEvent res={event} />}
                zIndex={10000} // Use this instead of inline style
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    margin: "0 50px 0 50px",
                  }}
                >
                  <span style={{ color: "#ffa700" }}>{event.client}</span>{" "}
                  <span style={{ opacity: "0" }}>{event.title}</span>{" "}
                  {isMobile ? (
                    <></>
                  ) : (
                    <span
                      style={{
                        color: "#00ff8c",
                      }}
                    >
                      {event.service === "Combo coupe et barbe" && "Combo"}
                      {event.service === "Coupe cheveux" && "Coupe"}
                      {event.service === "Coupe enfant (1 a 10ans)" && "Enfant"}
                      {event.service === "Barbe avec tondeuse ou lame" &&
                        "Tondeuse/Lame"}
                      {event.service === "Barbe avec serviette chaude" &&
                        "Barbe Serviette"}
                      {event.service === "Coupe et lavage" && "Coupe+Lavage"}
                    </span>
                  )}
                </span>
              </Tippy>
            )}
          </div>
        )}
      </>
    );
  };
  const handleViewChange = (view) => {
    setCurrentView(view);
    const current_Date = localStorage.getItem("calendarDay");
    setCurrentDay(new Date(current_Date));
    localStorage.setItem("calendarView", view);
  };

  const handleNavigate = (date) => {
    if (currentView === "month" || currentView === "agenda") {
      localStorage.setItem("calendarDay", date.toISOString());
      setCurrentDay(new Date(date));
    } else {
      localStorage.setItem("calendarDay", date.toISOString());
      setCurrentDay(date);
    }
  };
  const handleDeleteBlockedSlot = async (event) => {
    fetch(`http://localhost:4000/deleteBlockedSlot/${event._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setNotification(result.message);
          setBlockedSlots((prev) => {
            return prev.filter((slot) => {
              return slot._id !== event._id;
            });
          });
        } else {
          setNotification(result.message);
        }
      });
  };
  return (
    <Wrapper>
      {loading && (
        <Loading>
          <Loader style={{ opacity: "1" }} />
        </Loading>
      )}
      <StyledCalendar
        localizer={localizer}
        events={events}
        views={views}
        startAccessor="start"
        endAccessor="end"
        min={minTime}
        max={maxTime}
        defaultView={savedView}
        defaultDate={savedDay}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        components={{
          event: CustomEventComponent,
        }}
      />
      {showDeleteBlockedModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "1000",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>Blocked Slot</h2>
          <p>{selectedBlockedSlot.day}</p>
          <p>{selectedBlockedSlot.slot}</p>
          <button
            onClick={() => {
              handleDeleteBlockedSlot(selectedBlockedSlot);
              setShowDeleteBlockedModal(false);
            }}
            style={{
              backgroundColor: "#ff0000",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
          <button
            onClick={() => setShowDeleteBlockedModal(false)}
            style={{
              backgroundColor: "#ff0000",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </Wrapper>
  );
};
const Loading = styled.div`
  position: absolute;
  top: 18vh;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.4);
  z-index: 1000;
  padding: 0;
  margin: 0;
`;
const Wrapper = styled.div`
  height: 85vh;
  z-index: 100;
`;
const StyledCalendar = styled(Calendar)`
  margin: 20px;
  height: 95%;
`;

export default NewCalendar;
