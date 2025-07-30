import { getDailyHours } from "../helpers";
import { BarChart } from "@mui/x-charts/BarChart";
import { Title, Wrapper } from "./ServiceChart";
import React from "react";
const TimeSlotChart = React.memo(({ reservations }) => {
  const xAxis = getDailyHours();
  const xAxisRendered = xAxis.map((time) => {
    if (time.length === 6) {
      return "0" + time.slice(0, 4);
    }
    return time.slice(0, 5);
  });
  // Count the number of reservations for each time slot
  const timeSlotCounts = xAxis.map((timeSlot) => {
    let count = 0;
    reservations.forEach((res) => {
      res.slot.forEach((slot) => {
        if (slot.split("-")[1] === timeSlot) {
          count++;
        }
      });
    });
    return count;
  });
  return (
    <Wrapper>
      <Title>TimeSlots</Title>
      <BarChart
        xAxis={[
          {
            id: "barCategories",
            data: xAxisRendered,
            scaleType: "band",
          },
        ]}
        series={[
          {
            data: timeSlotCounts,
          },
        ]}
        height={500}
      />
    </Wrapper>
  );
});

export default TimeSlotChart;
