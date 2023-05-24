export const getDailyHours = () => {
  const daily = [];
  let hour = 9;
  let minute = 0;

  while (hour <= 20) {
    const suffix = hour < 12 ? "am" : "pm";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const time = `${formattedHour}:${minute
      .toString()
      .padStart(2, "0")}${suffix}`;
    daily.push(time);

    minute += 30; // Increment by 30 minutes
    if (minute >= 60) {
      minute = 0;
      hour++;
    }
  }
  return daily;
};
