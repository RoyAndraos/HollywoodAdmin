import { useEffect } from "react";
import { createContext, useState } from "react";
import io from "socket.io-client";
export const NotificationLogsContext = createContext("");
// handles notifications to be loaded
export const NotificationLogsProvider = ({ children }) => {
  const [notificationLogs, setNotificationLogs] = useState([]);
  useEffect(() => {
    const socket = io("http://localhost:4000");
    socket.on("connect", () => {
      console.log("Socket connected");
    });
    // Set up Socket.IO listeners for reservation updates
    socket.on("reservationChange", (change) => {
      const newChange = {
        ...change.fullDocument,
        read: false,
      };
      setNotificationLogs((prevLogs) => {
        console.log(prevLogs);
        if (prevLogs.length === 0) {
          console.log("empty");
          return [newChange];
        } else {
          return [...prevLogs, newChange];
        }
      });
    });
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

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
