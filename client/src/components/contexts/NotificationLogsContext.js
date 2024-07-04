import { useEffect, useContext } from "react";
import { createContext, useState } from "react";
import io from "socket.io-client";
import { ReservationContext } from "./ReservationContext";

export const NotificationLogsContext = createContext("");

export const NotificationLogsProvider = ({ children }) => {
  const [notificationLogs, setNotificationLogs] = useState([]);
  const { setReservations } = useContext(ReservationContext);

  useEffect(() => {
    const socket = io("https://hollywood-fairmount-admin.onrender.com");

    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    socket.on("reservationChange", (change) => {
      if (change.operationType === "insert") {
        const newChange = {
          ...change.fullDocument,
          read: false,
        };
        setNotificationLogs((prevLogs) => [...prevLogs, newChange]);
        setReservations((prevReservations) => [...prevReservations, newChange]);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    return () => {
      socket.disconnect();
      console.log("Disconnected from socket.io server");
    };
  }, [setReservations]);

  return (
    <NotificationLogsContext.Provider
      value={{ notificationLogs, setNotificationLogs }}
    >
      {children}
    </NotificationLogsContext.Provider>
  );
};
