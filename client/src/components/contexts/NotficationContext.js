import { createContext, useState } from "react";

export const NotificationContext = createContext("");
// handles notifications to be loaded
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState("");
  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
