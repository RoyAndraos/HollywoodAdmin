import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { styled } from "styled-components";
import { useContext } from "react";
import { ReservationContext } from "../contexts/ReservationContext";

const CalendarSchedule = () => {
  const { reservations } = useContext(ReservationContext);
  const convertTomonthNumber = (month) => {
    switch (month) {
      case "Jan":
        return "01";
      case "Feb":
        return "02";
      case "Mar":
        return "03";
      case "Apr":
        return "04";
      case "May":
        return "05";
      case "Jun":
        return "06";
      case "Jul":
        return "07";
      case "Aug":
        return "08";
      case "Sep":
        return "09";
      case "Oct":
        return "10";
      case "Nov":
        return "11";
      case "Dec":
        return "12";
      default:
        return "01";
    }
  };
  const editDatetoCalendarFormat = (date) => {
    const monthName = date.slice(4, 7);
    const month = convertTomonthNumber(monthName);
    const dayNumber = date.slice(8, 10);
    const year = date.slice(11, 15);
    const formattedDate = year + "-" + month + "-" + dayNumber;
    return formattedDate;
  };
  const editTimeTo24 = (time, toEdit) => {
    let editedTime;
    if (toEdit === "a") {
      editedTime = time;
      const formattedTime = "0" + editedTime.slice(0, 4) + ":00";
      return formattedTime;
    } else {
      let formattedTime;
      if (time.split(":")[0] !== "12") {
        editedTime = parseInt(time.split(":")[0]) + 12;
        formattedTime =
          editedTime.toString() + ":" + time.split(":")[1] + ":00";
      } else {
        editedTime = parseInt(time.split(":")[0]);
        formattedTime =
          editedTime.toString() + ":" + time.split(":")[1] + ":00";
      }
      return formattedTime.slice(0, 5) + formattedTime.slice(7, 10);
    }
  };

  const getEndTime = (startTime, duration) => {
    console.log(duration);
    const startTimeMinute = parseInt(startTime.split(":")[1]);
    let endTimeMinute;
    if (duration == 2) {
      endTimeMinute = startTimeMinute + 30;
      if (endTimeMinute > 60) {
        endTimeMinute = endTimeMinute - 60;
        let newEndTimeMinute = endTimeMinute.toString();
        if (newEndTimeMinute.length === 1) {
          newEndTimeMinute = "0" + newEndTimeMinute;
        }
        let newEndTimeHour = (parseInt(startTime.slice(11, 13)) + 1).toString();
        if (newEndTimeHour.length === 1) {
          newEndTimeHour = "0" + newEndTimeHour;
        }
        const newEndTime =
          startTime.slice(0, 11) +
          newEndTimeHour +
          ":" +
          newEndTimeMinute +
          ":00";
        return newEndTime;
      } else if (endTimeMinute === 60) {
        let newEndTimeMinute = "00";
        let newEndTimeHour = (parseInt(startTime.slice(11, 13)) + 1).toString();
        if (newEndTimeHour.length === 1) {
          newEndTimeHour = "0" + newEndTimeHour;
        }
        const newEndTime =
          startTime.slice(0, 11) +
          newEndTimeHour +
          ":" +
          newEndTimeMinute +
          ":00";
        return newEndTime;
      } else {
        let newEndTimeMinute = endTimeMinute.toString();
        const newEndTime =
          startTime.slice(0, 13) + ":" + newEndTimeMinute + ":00";
        return newEndTime;
      }
    } else {
      endTimeMinute = startTimeMinute + 15;
      if (endTimeMinute === 60) {
        let newEndTimeMinute = "00";
        let newEndTimeHour = (parseInt(startTime.slice(11, 13)) + 1).toString();
        if (newEndTimeHour.length === 1) {
          newEndTimeHour = "0" + newEndTimeHour;
        }
        const newEndTime =
          startTime.slice(0, 11) +
          newEndTimeHour +
          ":" +
          newEndTimeMinute +
          ":00";
        return newEndTime;
      } else {
        let newEndTimeMinute = endTimeMinute.toString();
        const newEndTime =
          startTime.slice(0, 13) + ":" + newEndTimeMinute + ":00";
        return newEndTime;
      }
    }
  };

  const events = reservations.map((reservation) => {
    let time = reservation.slot.split("-")[1];
    const toEdit = time.split("")[4];
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
