import { createContext, useState } from "react";

export const SelectedAdminContext = createContext({});

export const SelectedAdminProvider = ({ children }) => {
  const [selectedAdminInfo, setSelectedAdminInfo] = useState("");
  return (
    <SelectedAdminContext.Provider
      value={{ selectedAdminInfo, setSelectedAdminInfo }}
    >
      {children}
    </SelectedAdminContext.Provider>
  );
};
