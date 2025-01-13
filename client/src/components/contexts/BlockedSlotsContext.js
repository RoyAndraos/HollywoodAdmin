import { createContext, useState } from "react";

export const BlockedSlotsContext = createContext("");
export const BlockedSlotsProvider = ({ children }) => {
  const [blockedSlots, setBlockedSlots] = useState();
  return (
    <BlockedSlotsContext.Provider value={{ blockedSlots, setBlockedSlots }}>
      {children}
    </BlockedSlotsContext.Provider>
  );
};
