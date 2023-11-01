import { createContext, useState } from "react";

export const UserContext = createContext("");
// handles the barber information
export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
