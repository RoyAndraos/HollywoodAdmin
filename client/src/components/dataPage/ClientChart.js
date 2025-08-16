import { BarChart } from "@mui/x-charts/BarChart";
import { getDateRange } from "../helpers";
import { Wrapper, Title } from "./ServiceChart";
import moment from "moment";
import React, { useEffect, useState } from "react";
const ClientChart = React.memo(
  ({ clientsData, startDate, type, reservations }) => {
    const [sortedClientCounts, setSortedClientCounts] = useState([]);
    const [clientNames, setClientNames] = useState([]);
    const dateRange = getDateRange(new Date(startDate), type);
    // put it in a useEffect
    const [filteredClientsData, setFilteredClientsData] = useState([]);
    console.log(filteredClientsData);
    useEffect(() => {
      // Filter clients that have at least one reservation
      const filteredClients = clientsData.filter((client) =>
        reservations.some((res) => res.client_id === client._id)
      );

      setFilteredClientsData(filteredClients);

      // Create names array from filtered clients
      const clientNames = filteredClients.map(
        (client) => `${client.fname} ${client.lname}`
      );
      setClientNames(clientNames);

      // Count reservations in range for each filtered client
      const clientCounts = filteredClients.map(
        (client) =>
          reservations.filter(
            (res) =>
              res.client_id === client._id &&
              moment(new Date(res.date)).isBetween(
                dateRange.startDate,
                dateRange.endDate
              )
          ).length
      );

      // Sort counts in descending order
      setSortedClientCounts(clientCounts.sort((a, b) => b - a));
    }, [
      clientsData,
      reservations,
      dateRange.startDate,
      dateRange.endDate,
      type,
    ]);
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
  }
);

export default ClientChart;
