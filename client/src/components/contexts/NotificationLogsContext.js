import { useEffect } from "react";
import { createContext, useState } from "react";
import io from "socket.io-client";
export const NotificationLogsContext = createContext("");
// handles notifications to be loaded
export const NotificationLogsProvider = ({ children }) => {
  const [notificationLogs, setNotificationLogs] = useState([]);
  useEffect(() => {
    const socket = io("http://localhost:4000");
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
      } else {
        return;
      }
    });
    socket.on("connect_error", (err) => {});

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <NotificationLogsContext.Provider
      value={{ notificationLogs, setNotificationLogs }}
    >
      {children}
    </NotificationLogsContext.Provider>
  );
};
