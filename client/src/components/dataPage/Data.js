import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import ServiceChart from "./ServiceChart";
import ClientChart from "./ClientChart";
import TimeSlotChart from "./TimeSlotChart";
import DataTypeBar from "./DataTypeBar";
import Loader from "../Loader";
import { useMemo } from "react";

const Data = () => {
  const [type, setType] = useState("week");
  const [clients, setClients] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    //https://hollywood-fairmount-admin.onrender.com
    fetch(`http://localhost:4000/getDataPage`, {
      headers: headers,
    })
      .then((res) => res.json())
      .then((result) => {
        setClients(result.clients);
        setReservations(result.reservations);
      });
  }, []);
  useEffect(() => {
    console.log("type", type);
    const currentDate = new Date();

    if (type === "week") {
      console.log("type", type);

      // Set the date to the Monday of the current week
      const dayOfWeek = currentDate.getDay();
      const difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Calculate the difference to the previous Monday
      const monday = new Date(
        currentDate.setDate(currentDate.getDate() + difference)
      );
      setDate(monday);
    }

    if (type === "month") {
      // Set the date to the 1st of the current month
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      setDate(firstDayOfMonth);
    }

    if (type === "year") {
      // Set the date to January 1st of the current year
      const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
      setDate(firstDayOfYear);
    }
  }, [type]);

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
        date={date}
        setDate={setDate}
        type={type}
        setType={setType}
      />
      <ServiceChart date={date} type={type} reservations={reservations} />
      <ClientChart
        clientsData={clientsData}
        type={type}
        date={date}
        reservations={reservations}
      />
      <TimeSlotChart reservations={reservations} />
    </div>
  );
};

export default Data;
