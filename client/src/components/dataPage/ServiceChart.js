import { BarChart } from "@mui/x-charts/BarChart";
import { useContext } from "react";
import { ReservationContext } from "../contexts/ReservationContext";
import { ServicesContext } from "../contexts/ServicesContext";
import styled from "styled-components";
import { getDateRange } from "../helpers";
import moment from "moment";
const ServiceChart = ({ date, type }) => {
  const { reservations } = useContext(ReservationContext);
  const { services } = useContext(ServicesContext);
  const dateRange = getDateRange(date, type);
  const serviceNames = services.map((service) => {
    if (service.name.length > 15) {
      return service.name.slice(0, 15) + "...";
    }
    return service.name;
  });

  const serviceCounts = services.map((service) => {
    return reservations.filter((res) => {
      if (
        moment(new Date(res.date)).isBetween(
          dateRange.startDate,
          dateRange.endDate
        )
      ) {
        return res.service._id === service._id;
      } else {
        return false;
      }
    }).length;
  });

  return (
    <Wrapper>
      <Title>Services</Title>
      <BarChart
        xAxis={[
          {
            id: "barCategories",
            data: serviceNames,
            scaleType: "band",
          },
        ]}
        series={[
          {
            data: serviceCounts,
          },
        ]}
      />
    </Wrapper>
  );
};
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 20vh;
  width: 90vw;
  height: 70vh;
  margin-left: 5vw;
  margin-bottom: 15vh;
`;
export const Title = styled.h1`
  text-align: left;
  font-size: 2rem;
  margin-top: 1rem;

  font-family: "Roboto", sans-serif;
`;
export default ServiceChart;
