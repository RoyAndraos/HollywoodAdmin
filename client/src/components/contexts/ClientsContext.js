import { createContext, useEffect, useState } from "react";

export const ClientsContext = createContext("");
// handles services to be loaded
export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState();
  useEffect(() => {
    //sort the clients array by reservation count
    if (clients) {
      const sortedClients = clients.sort((a, b) => {
        return b.reservations.length - a.reservations.length;
      });
      setClients(sortedClients);
    }
  }, [clients]);
  return (
    <ClientsContext.Provider value={{ clients, setClients }}>
      {children}
    </ClientsContext.Provider>
  );
};
