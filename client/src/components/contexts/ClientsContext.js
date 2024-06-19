import { createContext, useState } from "react";

export const ClientsContext = createContext("");
// handles services to be loaded
export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState();
  return (
    <ClientsContext.Provider value={{ clients, setClients }}>
      {children}
    </ClientsContext.Provider>
  );
};
