export const getDailyHours = () => {
  const daily = [];
  let hour = 9;
  let minute = 0;

  while (hour <= 19) {
    const suffix = hour < 12 ? "am" : "pm";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

    for (let i = 0; i < 4; i++) {
      const time = `${formattedHour}:${minute
        .toString()
        .padStart(2, "0")}${suffix}`;
      daily.push(time);

      minute += 15; // Increment by 15 minutes
      if (minute >= 60) {
        minute = 0;
        hour++;
      }
    }
  }

  return daily;
};

export const initialAvailability = [
  { slot: "Mon-9:00am", available: true },
  { slot: "Mon-9:15am", available: true },
  { slot: "Mon-9:30am", available: true },
  { slot: "Mon-9:45am", available: true },
  { slot: "Mon-10:00am", available: true },
  { slot: "Mon-10:15am", available: true },
  { slot: "Mon-10:30am", available: true },
  { slot: "Mon-10:45am", available: true },
  { slot: "Mon-11:00am", available: true },
  { slot: "Mon-11:15am", available: true },
  { slot: "Mon-11:30am", available: true },
  { slot: "Mon-11:45am", available: true },
  { slot: "Mon-12:00pm", available: true },
  { slot: "Mon-12:15pm", available: true },
  { slot: "Mon-12:30pm", available: true },
  { slot: "Mon-12:45pm", available: true },
  { slot: "Mon-1:00pm", available: true },
  { slot: "Mon-1:15pm", available: true },
  { slot: "Mon-1:30pm", available: true },
  { slot: "Mon-1:45pm", available: true },
  { slot: "Mon-2:00pm", available: true },
  { slot: "Mon-2:15pm", available: true },
  { slot: "Mon-2:30pm", available: true },
  { slot: "Mon-2:45pm", available: true },
  { slot: "Mon-3:00pm", available: true },
  { slot: "Mon-3:15pm", available: true },
  { slot: "Mon-3:30pm", available: true },
  { slot: "Mon-3:45pm", available: true },
  { slot: "Mon-4:00pm", available: true },
  { slot: "Mon-4:15pm", available: true },
  { slot: "Mon-4:30pm", available: true },
  { slot: "Mon-4:45pm", available: true },
  { slot: "Mon-5:00pm", available: true },
  { slot: "Mon-5:15pm", available: true },
  { slot: "Mon-5:30pm", available: true },
  { slot: "Mon-5:45pm", available: true },
  { slot: "Mon-6:00pm", available: true },
  { slot: "Mon-6:15pm", available: true },
  { slot: "Mon-6:30pm", available: true },
  { slot: "Mon-6:45pm", available: true },
  { slot: "Mon-7:00pm", available: true },
  { slot: "Mon-7:15pm", available: true },
  { slot: "Mon-7:30pm", available: true },
  { slot: "Mon-7:45pm", available: true },
  { slot: "Tue-9:00am", available: true },
  { slot: "Tue-9:15am", available: true },
  { slot: "Tue-9:30am", available: true },
  { slot: "Tue-9:45am", available: true },
  { slot: "Tue-10:00am", available: true },
  { slot: "Tue-10:15am", available: true },
  { slot: "Tue-10:30am", available: true },
  { slot: "Tue-10:45am", available: true },
  { slot: "Tue-11:00am", available: true },
  { slot: "Tue-11:15am", available: true },
  { slot: "Tue-11:30am", available: true },
  { slot: "Tue-11:45am", available: true },
  { slot: "Tue-12:00pm", available: true },
  { slot: "Tue-12:15pm", available: true },
  { slot: "Tue-12:30pm", available: true },
  { slot: "Tue-12:45pm", available: true },
  { slot: "Tue-1:00pm", available: true },
  { slot: "Tue-1:15pm", available: true },
  { slot: "Tue-1:30pm", available: true },
  { slot: "Tue-1:45pm", available: true },
  { slot: "Tue-2:00pm", available: true },
  { slot: "Tue-2:15pm", available: true },
  { slot: "Tue-2:30pm", available: true },
  { slot: "Tue-2:45pm", available: true },
  { slot: "Tue-3:00pm", available: true },
  { slot: "Tue-3:15pm", available: true },
  { slot: "Tue-3:30pm", available: true },
  { slot: "Tue-3:45pm", available: true },
  { slot: "Tue-4:00pm", available: true },
  { slot: "Tue-4:15pm", available: true },
  { slot: "Tue-4:30pm", available: true },
  { slot: "Tue-4:45pm", available: true },
  { slot: "Tue-5:00pm", available: true },
  { slot: "Tue-5:15pm", available: true },
  { slot: "Tue-5:30pm", available: true },
  { slot: "Tue-5:45pm", available: true },
  { slot: "Tue-6:00pm", available: true },
  { slot: "Tue-6:15pm", available: true },
  { slot: "Tue-6:30pm", available: true },
  { slot: "Tue-6:45pm", available: true },
  { slot: "Tue-7:00pm", available: true },
  { slot: "Tue-7:15pm", available: true },
  { slot: "Tue-7:30pm", available: true },
  { slot: "Tue-7:45pm", available: true },
  { slot: "Wed-9:00am", available: true },
  { slot: "Wed-9:15am", available: true },
  { slot: "Wed-9:30am", available: true },
  { slot: "Wed-9:45am", available: true },
  { slot: "Wed-10:00am", available: true },
  { slot: "Wed-10:15am", available: true },
  { slot: "Wed-10:30am", available: true },
  { slot: "Wed-10:45am", available: true },
  { slot: "Wed-11:00am", available: true },
  { slot: "Wed-11:15am", available: true },
  { slot: "Wed-11:30am", available: true },
  { slot: "Wed-11:45am", available: true },
  { slot: "Wed-12:00pm", available: true },
  { slot: "Wed-12:15pm", available: true },
  { slot: "Wed-12:30pm", available: true },
  { slot: "Wed-12:45pm", available: true },
  { slot: "Wed-1:00pm", available: true },
  { slot: "Wed-1:15pm", available: true },
  { slot: "Wed-1:30pm", available: true },
  { slot: "Wed-1:45pm", available: true },
  { slot: "Wed-2:00pm", available: true },
  { slot: "Wed-2:15pm", available: true },
  { slot: "Wed-2:30pm", available: true },
  { slot: "Wed-2:45pm", available: true },
  { slot: "Wed-3:00pm", available: true },
  { slot: "Wed-3:15pm", available: true },
  { slot: "Wed-3:30pm", available: true },
  { slot: "Wed-3:45pm", available: true },
  { slot: "Wed-4:00pm", available: true },
  { slot: "Wed-4:15pm", available: true },
  { slot: "Wed-4:30pm", available: true },
  { slot: "Wed-4:45pm", available: true },
  { slot: "Wed-5:00pm", available: true },
  { slot: "Wed-5:15pm", available: true },
  { slot: "Wed-5:30pm", available: true },
  { slot: "Wed-5:45pm", available: true },
  { slot: "Wed-6:00pm", available: true },
  { slot: "Wed-6:15pm", available: true },
  { slot: "Wed-6:30pm", available: true },
  { slot: "Wed-6:45pm", available: true },
  { slot: "Wed-7:00pm", available: true },
  { slot: "Wed-7:15pm", available: true },
  { slot: "Wed-7:30pm", available: true },
  { slot: "Wed-7:45pm", available: true },
  { slot: "Thu-9:00am", available: true },
  { slot: "Thu-9:15am", available: true },
  { slot: "Thu-9:30am", available: true },
  { slot: "Thu-9:45am", available: true },
  { slot: "Thu-10:00am", available: true },
  { slot: "Thu-10:15am", available: true },
  { slot: "Thu-10:30am", available: true },
  { slot: "Thu-10:45am", available: true },
  { slot: "Thu-11:00am", available: true },
  { slot: "Thu-11:15am", available: true },
  { slot: "Thu-11:30am", available: true },
  { slot: "Thu-11:45am", available: true },
  { slot: "Thu-12:00pm", available: true },
  { slot: "Thu-12:15pm", available: true },
  { slot: "Thu-12:30pm", available: true },
  { slot: "Thu-12:45pm", available: true },
  { slot: "Thu-1:00pm", available: true },
  { slot: "Thu-1:15pm", available: true },
  { slot: "Thu-1:30pm", available: true },
  { slot: "Thu-1:45pm", available: true },
  { slot: "Thu-2:00pm", available: true },
  { slot: "Thu-2:15pm", available: true },
  { slot: "Thu-2:30pm", available: true },
  { slot: "Thu-2:45pm", available: true },
  { slot: "Thu-3:00pm", available: true },
  { slot: "Thu-3:15pm", available: true },
  { slot: "Thu-3:30pm", available: true },
  { slot: "Thu-3:45pm", available: true },
  { slot: "Thu-4:00pm", available: true },
  { slot: "Thu-4:15pm", available: true },
  { slot: "Thu-4:30pm", available: true },
  { slot: "Thu-4:45pm", available: true },
  { slot: "Thu-5:00pm", available: true },
  { slot: "Thu-5:15pm", available: true },
  { slot: "Thu-5:30pm", available: true },
  { slot: "Thu-5:45pm", available: true },
  { slot: "Thu-6:00pm", available: true },
  { slot: "Thu-6:15pm", available: true },
  { slot: "Thu-6:30pm", available: true },
  { slot: "Thu-6:45pm", available: true },
  { slot: "Thu-7:00pm", available: true },
  { slot: "Thu-7:15pm", available: true },
  { slot: "Thu-7:30pm", available: true },
  { slot: "Thu-7:45pm", available: true },
  { slot: "Fri-9:00am", available: true },
  { slot: "Fri-9:15am", available: true },
  { slot: "Fri-9:30am", available: true },
  { slot: "Fri-9:45am", available: true },
  { slot: "Fri-10:00am", available: true },
  { slot: "Fri-10:15am", available: true },
  { slot: "Fri-10:30am", available: true },
  { slot: "Fri-10:45am", available: true },
  { slot: "Fri-11:00am", available: true },
  { slot: "Fri-11:15am", available: true },
  { slot: "Fri-11:30am", available: true },
  { slot: "Fri-11:45am", available: true },
  { slot: "Fri-12:00pm", available: true },
  { slot: "Fri-12:15pm", available: true },
  { slot: "Fri-12:30pm", available: true },
  { slot: "Fri-12:45pm", available: true },
  { slot: "Fri-1:00pm", available: true },
  { slot: "Fri-1:15pm", available: true },
  { slot: "Fri-1:30pm", available: true },
  { slot: "Fri-1:45pm", available: true },
  { slot: "Fri-2:00pm", available: true },
  { slot: "Fri-2:15pm", available: true },
  { slot: "Fri-2:30pm", available: true },
  { slot: "Fri-2:45pm", available: true },
  { slot: "Fri-3:00pm", available: true },
  { slot: "Fri-3:15pm", available: true },
  { slot: "Fri-3:30pm", available: true },
  { slot: "Fri-3:45pm", available: true },
  { slot: "Fri-4:00pm", available: true },
  { slot: "Fri-4:15pm", available: true },
  { slot: "Fri-4:30pm", available: true },
  { slot: "Fri-4:45pm", available: true },
  { slot: "Fri-5:00pm", available: true },
  { slot: "Fri-5:15pm", available: true },
  { slot: "Fri-5:30pm", available: true },
  { slot: "Fri-5:45pm", available: true },
  { slot: "Fri-6:00pm", available: true },
  { slot: "Fri-6:15pm", available: true },
  { slot: "Fri-6:30pm", available: true },
  { slot: "Fri-6:45pm", available: true },
  { slot: "Fri-7:00pm", available: true },
  { slot: "Fri-7:15pm", available: true },
  { slot: "Fri-7:30pm", available: true },
  { slot: "Fri-7:45pm", available: true },
  { slot: "Sat-9:00am", available: true },
  { slot: "Sat-9:15am", available: true },
  { slot: "Sat-9:30am", available: true },
  { slot: "Sat-9:45am", available: true },
  { slot: "Sat-10:00am", available: true },
  { slot: "Sat-10:15am", available: true },
  { slot: "Sat-10:30am", available: true },
  { slot: "Sat-10:45am", available: true },
  { slot: "Sat-11:00am", available: true },
  { slot: "Sat-11:15am", available: true },
  { slot: "Sat-11:30am", available: true },
  { slot: "Sat-11:45am", available: true },
  { slot: "Sat-12:00pm", available: true },
  { slot: "Sat-12:15pm", available: true },
  { slot: "Sat-12:30pm", available: true },
  { slot: "Sat-12:45pm", available: true },
  { slot: "Sat-1:00pm", available: true },
  { slot: "Sat-1:15pm", available: true },
  { slot: "Sat-1:30pm", available: true },
  { slot: "Sat-1:45pm", available: true },
  { slot: "Sat-2:00pm", available: true },
  { slot: "Sat-2:15pm", available: true },
  { slot: "Sat-2:30pm", available: true },
  { slot: "Sat-2:45pm", available: true },
  { slot: "Sat-3:00pm", available: true },
  { slot: "Sat-3:15pm", available: true },
  { slot: "Sat-3:30pm", available: true },
  { slot: "Sat-3:45pm", available: true },
  { slot: "Sat-4:00pm", available: true },
  { slot: "Sat-4:15pm", available: true },
  { slot: "Sat-4:30pm", available: true },
  { slot: "Sat-4:45pm", available: true },
  { slot: "Sat-5:00pm", available: true },
  { slot: "Sat-5:15pm", available: true },
  { slot: "Sat-5:30pm", available: true },
  { slot: "Sat-5:45pm", available: true },
  { slot: "Sat-6:00pm", available: true },
  { slot: "Sat-6:15pm", available: true },
  { slot: "Sat-6:30pm", available: true },
  { slot: "Sat-6:45pm", available: true },
  { slot: "Sat-7:00pm", available: true },
  { slot: "Sat-7:15pm", available: true },
  { slot: "Sat-7:30pm", available: true },
  { slot: "Sat-7:45pm", available: true },
  { slot: "Sun-9:00am", available: true },
  { slot: "Sun-9:15am", available: true },
  { slot: "Sun-9:30am", available: true },
  { slot: "Sun-9:45am", available: true },
  { slot: "Sun-10:00am", available: true },
  { slot: "Sun-10:15am", available: true },
  { slot: "Sun-10:30am", available: true },
  { slot: "Sun-10:45am", available: true },
  { slot: "Sun-11:00am", available: true },
  { slot: "Sun-11:15am", available: true },
  { slot: "Sun-11:30am", available: true },
  { slot: "Sun-11:45am", available: true },
  { slot: "Sun-12:00pm", available: true },
  { slot: "Sun-12:15pm", available: true },
  { slot: "Sun-12:30pm", available: true },
  { slot: "Sun-12:45pm", available: true },
  { slot: "Sun-1:00pm", available: true },
  { slot: "Sun-1:15pm", available: true },
  { slot: "Sun-1:30pm", available: true },
  { slot: "Sun-1:45pm", available: true },
  { slot: "Sun-2:00pm", available: true },
  { slot: "Sun-2:15pm", available: true },
  { slot: "Sun-2:30pm", available: true },
  { slot: "Sun-2:45pm", available: true },
  { slot: "Sun-3:00pm", available: true },
  { slot: "Sun-3:15pm", available: true },
  { slot: "Sun-3:30pm", available: true },
  { slot: "Sun-3:45pm", available: true },
  { slot: "Sun-4:00pm", available: true },
  { slot: "Sun-4:15pm", available: true },
  { slot: "Sun-4:30pm", available: true },
  { slot: "Sun-4:45pm", available: true },
  { slot: "Sun-5:00pm", available: true },
  { slot: "Sun-5:15pm", available: true },
  { slot: "Sun-5:30pm", available: true },
  { slot: "Sun-5:45pm", available: true },
  { slot: "Sun-6:00pm", available: true },
  { slot: "Sun-6:15pm", available: true },
  { slot: "Sun-6:30pm", available: true },
  { slot: "Sun-6:45pm", available: true },
  { slot: "Sun-7:00pm", available: true },
  { slot: "Sun-7:15pm", available: true },
  { slot: "Sun-7:30pm", available: true },
  { slot: "Sun-7:45pm", available: true },
];

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
export const editDatetoCalendarFormat = (date) => {
  const monthName = date.slice(4, 7);
  const month = convertTomonthNumber(monthName);
  const dayNumber = date.slice(8, 10);
  const year = date.slice(11, 15);
  const formattedDate = year + "-" + month + "-" + dayNumber;
  return formattedDate;
};
export const editTimeTo24 = (time, toEdit) => {
  let editedTime;
  if (toEdit === "am") {
    editedTime = time;
    let formattedTime;
    if (time.split(":")[0].length === 1) {
      formattedTime = "0" + editedTime.slice(0, 5) + ":00";
      console.log(formattedTime);
    } else {
      formattedTime = editedTime.slice(0, 5) + ":00";
    }
    return formattedTime;
  } else {
    let formattedTime;
    if (time.split(":")[0] !== "12") {
      editedTime = parseInt(time.split(":")[0]) + 12;
      formattedTime = editedTime.toString() + ":" + time.split(":")[1] + ":00";
    } else {
      editedTime = parseInt(time.split(":")[0]);
      formattedTime = editedTime.toString() + ":" + time.split(":")[1] + ":00";
    }
    return formattedTime.slice(0, 5) + formattedTime.slice(7, 10);
  }
};

export const getEndTime = (startTime, duration) => {
  const startTimeMinute = parseInt(startTime.split(":")[1]);
  let endTimeMinute;
  if (parseInt(duration) === 2) {
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

export const customStyles = `
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
