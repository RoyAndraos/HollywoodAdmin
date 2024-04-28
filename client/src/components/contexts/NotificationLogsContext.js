import { useEffect, useContext } from "react";
import { createContext, useState } from "react";
import io from "socket.io-client";
import { ReservationContext } from "./ReservationContext";

export const NotificationLogsContext = createContext("");
// handles notifications to be loaded
export const NotificationLogsProvider = ({ children }) => {
  const [notificationLogs, setNotificationLogs] = useState([]);
  const { setReservations } = useContext(ReservationContext);
  useEffect(() => {
    const socket = io("https://hollywood-fairmount-admin.onrender.com");
    socket.on("connect", () => {});
    // Set up Socket.IO listeners for reservation updates
    socket.on("reservationChange", (change) => {
      if (change.operationType === "insert") {
        const newChange = {
          ...change.fullDocument,
          read: false,
        };
        setNotificationLogs((prevLogs) => {
          if (prevLogs.length === 0) {
            return [newChange];
          } else {
            return [...prevLogs, newChange];
          }
        });
        setReservations((prevReservations) => {
          return [...prevReservations, newChange];
        });
      } else {
        return;
      }
    });
    socket.on("connect_error", (err) => {});

    return () => {
      socket.disconnect();
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
