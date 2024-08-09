export const getClientByNumber = (number, clients) => {
  return clients.filter((client) => client.number.includes(number));
};

export const getDailyHours = () => {
  const daily = [];
  let hour = 9;
  let minute = 0;

  while (hour <= 18) {
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
  } else if (parseInt(duration) === 1) {
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
  } else if (duration === "4") {
    endTimeMinute = startTimeMinute + 60;
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
  } else if (duration === "3") {
    endTimeMinute = startTimeMinute + 45;
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
    if (hourToEdit !== "1") {
      const newHour = parseInt(slot.slice(0, -2).split(":")[0]) - 1;
      if (newHour.toString().length === 2) {
        return newHour.toString() + ":" + newMinute + slot.slice(-2);
      } else {
        return "0" + newHour.toString() + ":" + newMinute + slot.slice(-2);
      }
    } else {
      const newHour = "12";
      return newHour + ":" + newMinute + "pm";
    }
  }
};

export const removeSlotsForOverLapping = (
  serviceDuration,
  todayReservationStartingSlots
) => {
  let slotsToRemove = [];
  switch (serviceDuration) {
    case "1":
      break;
    case "2":
      todayReservationStartingSlots.forEach((slot) => {
        const slotToEdit = filterSlotBeforeFor2Duration(slot);
        slotsToRemove.push(slotToEdit);
      });
      break;
    case "3":
      todayReservationStartingSlots.forEach((slot) => {
        const slotToEdit = filterSlotBeforeFor2Duration(slot);
        slotsToRemove.push(slotToEdit);
        const slotToEdit2 = filterSlotBeforeFor2Duration(slotToEdit);
        slotsToRemove.push(slotToEdit2);
      });
      break;
    case "4":
      todayReservationStartingSlots.forEach((slot) => {
        const slotToEdit = filterSlotBeforeFor2Duration(slot);
        slotsToRemove.push(slotToEdit);
        const slotToEdit2 = filterSlotBeforeFor2Duration(slotToEdit);
        slotsToRemove.push(slotToEdit2);
        const slotToEdit3 = filterSlotBeforeFor2Duration(slotToEdit2);
        slotsToRemove.push(slotToEdit3);
      });
      break;
    default:
      break;
  }

  return slotsToRemove.map((slot) => {
    if (slot[0] === "0") {
      return slot.slice(1);
    }
    return slot;
  });
};

export const selectNextSlot = (slot) => {
  const day = slot.split("-")[0];
  const timeToEdit = slot.split("-")[1].split(":")[1].slice(0, -2);
  const hour = slot.split("-")[1].split(":")[0];
  let AMPM = slot.slice(-2);
  let newTimeMinute = parseInt(timeToEdit) + 15;
  if (newTimeMinute === 60) {
    newTimeMinute = "00";
    let newHour = parseInt(slot.split("-")[1].split(":")[0]) + 1;
    if (newHour === 12) {
      AMPM = "pm";
      return `${day}-${newHour}:${newTimeMinute}${AMPM}`;
    } else if (newHour === 13) {
      newHour = 1;
      return `${day}-${newHour}:${newTimeMinute}pm`;
    } else {
      return `${day}-${newHour}:${newTimeMinute}${AMPM}`;
    }
  } else {
    return `${day}-${hour}:${newTimeMinute}${AMPM}`;
  }
};

export const getEndTimeEditRsvp = (lastSlot) => {
  let lastSlotMinute = parseInt(lastSlot.split(":")[1]);
  let lastSlotHour = parseInt(lastSlot.split(":")[0]);
  const prefix = lastSlot.slice(-2);
  if (lastSlotMinute === 45 && lastSlotHour !== 12) {
    const newHour = parseInt(lastSlot.split(":")[0]) + 1;
    if (newHour.toString().length === 2) {
      return newHour.toString() + ":00" + prefix;
    } else {
      return "0" + newHour.toString() + ":00" + prefix;
    }
  } else if (lastSlotHour === 12 && lastSlotMinute === 45) {
    lastSlotHour = 1;
    if (lastSlotHour.toString().length === 2) {
      return lastSlotHour.toString() + ":00pm";
    } else {
      return "0" + lastSlotHour.toString() + ":00pm";
    }
  } else {
    const newMinute = lastSlotMinute + 15;
    if (newMinute.toString().length === 2) {
      return lastSlotHour.toString() + ":" + newMinute.toString() + prefix;
    } else {
      return (
        "0" + lastSlotHour.toString() + ":" + newMinute.toString() + prefix
      );
    }
  }
};

export const isEqual = (objA, objB) => {
  const keysA = Object.keys(objA);

  for (const key of keysA) {
    if (key === "slot") {
      // Compare arrays
      if (!arraysAreEqual(objA[key], objB[key])) {
        return false;
      }
    } else if (key === "service") {
      // Compare objects
      if (!objectsAreEqual(objA[key], objB[key])) {
        return false;
      }
    } else if (objA[key] !== objB[key]) {
      // Compare other types
      return false;
    }
  }

  return true;
};

// Function to compare arrays
export const arraysAreEqual = (arrayA, arrayB) => {
  if (arrayA.length !== arrayB.length) {
    return false;
  }

  for (let i = 0; i < arrayA.length; i++) {
    if (arrayA[i] !== arrayB[i]) {
      return false;
    }
  }

  return true;
};

// Function to compare objects
export const objectsAreEqual = (objA, objB) => {
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false;
    }

    if (objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
};

export const getDateRange = (startDate, type) => {
  const endDate = new Date(startDate);
  if (type === "week") {
    endDate.setDate(endDate.getDate() + 7);
  } else if (type === "month") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (type === "year") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  return { startDate: startDate, endDate: endDate };
};

export const getClientsByName = (chars, clients) => {
  return clients.filter((client) => {
    return (
      client.fname.toLowerCase().includes(chars.toLowerCase()) ||
      client.lname.toLowerCase().includes(chars.toLowerCase())
    );
  });
};

export const highlightText = (text, query) => {
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  if (parts.length > 4) {
    return text;
  }
  return parts.map((part, index) =>
    regex.test(part) ? (
      <span
        key={index}
        style={{
          color: "black",
          fontWeight: "bold",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};

// 8.3% is 1 hour
// 2.075% is 15 minutes
