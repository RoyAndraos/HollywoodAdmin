import { createContext, useState } from "react";

export const LoginRoleContext = createContext("");

export const LoginRoleProvider = ({ children }) => {
  const [role, setRole] = useState("");

  return (
    <LoginRoleContext.Provider value={{ role, setRole }}>
      {children}
    </LoginRoleContext.Provider>
  );
};
