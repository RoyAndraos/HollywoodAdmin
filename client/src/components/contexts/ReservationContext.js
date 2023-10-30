import { createContext, useState } from "react";

export const ReservationContext = createContext("");

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState();

  return (
    <ReservationContext.Provider value={{ reservations, setReservations }}>
      {children}
    </ReservationContext.Provider>
  );
};
