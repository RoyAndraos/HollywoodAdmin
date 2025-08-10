import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { ReservationContext } from "./ReservationContext";

export const NotificationLogsContext = createContext("");

export const NotificationLogsProvider = ({ children }) => {
  const [notificationLogs, setNotificationLogs] = useState([]);
  const { setReservations } = useContext(ReservationContext);
  useEffect(() => {
    const eventSource = new EventSource(
      "https://hollywood-fairmount-admin.onrender.com/events"
    );
    console.log("EventSource initialized", eventSource);
    eventSource.onmessage = (event) => {
      const change = JSON.parse(event.data);
      // Update state with the new change
      if (change.operationType === "insert") {
        setNotificationLogs((prev) => [change.fullDocument, ...prev]);
        setReservations((prev) => [change.fullDocument, ...prev]);
      } else if (change.operationType === "delete") {
        setNotificationLogs((prev) =>
          prev.filter((log) => log._id !== change._id)
        );
        setReservations((prev) => prev.filter((log) => log._id !== change._id));
      }
    };
    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
    };

    return () => {
      eventSource.close();
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
