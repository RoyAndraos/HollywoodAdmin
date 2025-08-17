import { useEffect } from "react";
import { createContext, useState } from "react";

export const NotificationLogsContext = createContext("");

export const NotificationLogsProvider = ({ children }) => {
  const [notificationLogs, setNotificationLogs] = useState([]);
  useEffect(() => {
    const eventSource = new EventSource(
      "https://hollywood-fairmount-admin.onrender.com/events"
    );
    eventSource.onmessage = (event) => {
      const change = JSON.parse(event.data);
      // Update state with the new change
      if (change.operationType === "insert") {
        setNotificationLogs((prev) => [change.fullDocument, ...prev]);
      } else if (change.operationType === "delete") {
        setNotificationLogs((prev) =>
          prev.filter((log) => log._id !== change._id)
        );
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
