import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import ServiceChart from "./ServiceChart";
import ClientChart from "./ClientChart";
// import TimeSlotChart from "./TimeSlotChart";
import DataTypeBar from "./DataTypeBar";
import Loader from "../Loader";
import { useMemo } from "react";

const Data = () => {
  const [type, setType] = useState("week");
  const [clients, setClients] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    //set end date to today
    //set start date to one month ago
    const today = new Date();
    setEndDate(formatDate(today));
    const lastMonth = new Date(today);
    if (type === "month") {
      lastMonth.setMonth(today.getMonth() - 1);
      setStartDate(formatDate(lastMonth));
    } else if (type === "week") {
      lastMonth.setDate(today.getDate() - 7);
      setStartDate(formatDate(lastMonth));
    }

    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    //https://hollywood-fairmount-admin.onrender.com
    fetch(
      `http://localhost:4000/getDataPage?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: headers,
      }
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setClients(result.clients);
        setReservations(result.reservations);
      });
  }, [startDate, endDate, type]);

  // go through clients and replace the reservations array (which usually is an array of ids) with the actual reservation objects
  const clientsData = useMemo(() => {
    if (clients.length === 0 || reservations.length === 0) return [];

    return clients.map((client) => {
      const newReservations = client.reservations.map((resId) =>
        reservations.find((res) => res._id === resId)
      );
      return { ...client, reservations: newReservations };
    });
  }, [clients, reservations]);
  if (!clientsData) {
    return <Loader />;
  }
  return (
    <div>
      <DataTypeBar
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        type={type}
        setType={setType}
      />

      <ServiceChart
        startDate={startDate}
        endDate={endDate}
        type={type}
        reservations={reservations}
      />

      <ClientChart
        clientsData={clientsData}
        type={type}
        startDate={startDate}
        endDate={endDate}
        reservations={reservations}
      />
      {/* <TimeSlotChart
        startDate={startDate}
        endDate={endDate}
        reservations={reservations}
      /> */}
    </div>
  );
};

export default Data;
