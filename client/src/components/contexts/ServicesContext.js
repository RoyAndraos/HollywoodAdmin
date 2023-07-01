import { createContext, useState } from "react";

export const ServicesContext = createContext("");

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState();
  return (
    <ServicesContext.Provider value={{ services, setServices }}>
      {children}
    </ServicesContext.Provider>
  );
};
