import { useContext } from "react";
import { ReservationContext } from "../contexts/ReservationContext";
import { BarChart } from "@mui/x-charts/BarChart";
import { getDateRange } from "../helpers";
import { Wrapper, Title } from "./ServiceChart";
import moment from "moment";
const ClientChart = ({ clientsData, date, type }) => {
  const { reservations } = useContext(ReservationContext);
  const dateRange = getDateRange(date, type);
  const clientNames = clientsData.map((client) => {
    return client.fname + " " + client.lname;
  });

  const clientCounts = clientsData.map((client) => {
    return reservations.filter((res) => {
      if (
        moment(new Date(res.date)).isBetween(
          dateRange.startDate,
          dateRange.endDate
        )
      ) {
        return res.client_id === client._id;
      } else {
        return false;
      }
    }).length;
  });
  const sortedClientCounts = clientCounts.sort((a, b) => b - a);

  return (
    <Wrapper>
      <Title>Clients</Title>
      <BarChart
        xAxis={[
          {
            id: "barCategories",
            data: clientNames,
            scaleType: "band",
          },
        ]}
        series={[
          {
            data: sortedClientCounts,
          },
        ]}
        height={500}
      />
    </Wrapper>
  );
};

export default ClientChart;
