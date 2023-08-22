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
      formattedTime = "0" + editedTime.slice(0, 4) + ":00";
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

export const filterSlotBeforeFor2Duration = (slot) => {
  const minuteToEdit = slot.slice(0, -2).split(":")[1];
  if (minuteToEdit !== "00") {
    const newMinute = parseInt(minuteToEdit) - 15;
    if (newMinute === 0) {
      return slot.split(":")[0] + ":00" + slot.slice(-2);
    } else {
      return (
        slot.slice(0, -2).split(":")[0] +
        ":" +
        newMinute.toString() +
        slot.slice(-2)
      );
    }
  } else {
    const newMinute = "45";
    const hourToEdit = slot.slice(0, -2).split(":")[0];
    if (hourToEdit !== "12") {
      const newHour = parseInt(slot.slice(0, -2).split(":")[0]) - 1;
      if (newHour.toString().length === 2) {
        return newHour.toString() + ":" + newMinute + slot.slice(-2);
      } else {
        return "0" + newHour.toString() + ":" + newMinute + slot.slice(-2);
      }
    } else {
      const newHour = "11";
      return newHour + ":" + newMinute + "am";
    }
  }
};


const timeToPercent = [
  { time: "9:00am", percent: 0 },
  { time: "9:15am", percent: 2.075 },
  { time: "9:30am", percent: 4.15 },
  { time: "9:45am", percent: 6.225 },
  { time: "10:00am", percent: 8.3 },
  { time: "10:15am", percent: 10.375 },
  { time: "10:30am", percent: 12.45 },
  { time: "10:45am", percent: 14.525 },
  { time: "11:00am", percent: 16.6 },
  { time: "11:15am", percent: 18.675 },
  { time: "11:30am", percent: 20.75 },
  { time: "11:45am", percent: 22.825 },
  { time: "12:00pm", percent: 24.9 },
  { time: "12:15pm", percent: 26.975 },
  { time: "12:30pm", percent: 29.05 },
  { time: "12:45pm", percent: 31.125 },
  { time: "1:00pm", percent: 33.2 },
  { time: "1:15pm", percent: 35.275 },
  { time: "1:30pm", percent: 37.35 },
  { time: "1:45pm", percent: 39.425 },
  { time: "2:00pm", percent: 41.5 },
  { time: "2:15pm", percent: 43.575 },
  { time: "2:30pm", percent: 45.65 },
  { time: "2:45pm", percent: 47.725 },
  { time: "3:00pm", percent: 49.8 },
  { time: "3:15pm", percent: 51.875 },
  { time: "3:30pm", percent: 53.95 },
  { time: "3:45pm", percent: 56.025 },
  { time: "4:00pm", percent: 58.1 },
  { time: "4:15pm", percent: 60.175 },
  { time: "4:30pm", percent: 62.25 },
  { time: "4:45pm", percent: 64.325 },
  { time: "5:00pm", percent: 66.4 },
  { time: "5:15pm", percent: 68.475 },
  { time: "5:30pm", percent: 70.55 },
  { time: "5:45pm", percent: 72.625 },
  { time: "6:00pm", percent: 74.7 },
  { time: "6:15pm", percent: 76.775 },
  { time: "6:30pm", percent: 78.85 },
  { time: "6:45pm", percent: 80.925 },
  { time: "7:00pm", percent: 83 },
  { time: "7:15pm", percent: 85.075 },
  { time: "7:30pm", percent: 87.15 },
  { time: "7:45pm", percent: 89.225 },
];

export const convertRsvpTimeToTopProp = (startTime, endTime) => {
  const topProp = timeToPercent.filter((time) => {
    return time.time === startTime;
  });
  const top = topProp[0].percent;

  const heightProp = timeToPercent.filter((time) => {
    return time.time === endTime;
  });
  const height = heightProp[0].percent - topProp[0].percent;

  return { top, height };
};

export const getEndTimeEditRsvp = (lastSlot)=>{
  let lastSlotMinute = parseInt(lastSlot.split(":")[1]);
  let lastSlotHour = parseInt(lastSlot.split(":")[0]); 
  const prefix = lastSlot.slice( -2);
  if(lastSlotMinute === 45 && lastSlotHour !== 12){
    const newHour = parseInt(lastSlot.split(":")[0]) + 1;
    if(newHour.toString().length === 2){
    return newHour.toString() + ":00" + prefix;
  } else{
    return "0" + newHour.toString() + ":00" + prefix;
  }
  } else if(lastSlotHour === 12 && lastSlotMinute === 45){
    lastSlotHour = 1;
    if(lastSlotHour.toString().length === 2){
    return lastSlotHour.toString() + ":00pm";
  } else{
    return "0" + lastSlotHour.toString() + ":00pm";
  }
  } else{
    const newMinute = lastSlotMinute + 15;
    if(newMinute.toString().length === 2){
    return lastSlotHour.toString() + ":" + newMinute.toString() + prefix;
  } else{
    return "0"+lastSlotHour.toString() + ":" + newMinute.toString() + prefix;
  }
  }
}

// 8.3% is 1 hour
// 2.075% is 15 minutes
