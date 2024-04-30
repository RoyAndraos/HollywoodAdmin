import { createContext, useState } from "react";

export const EmployeeServicesContext = createContext("");
// handles services to be loaded
export const EmployeeServicesProvider = ({ children }) => {
  const [servicesEmp, setServicesEmp] = useState();
  return (
    <EmployeeServicesContext.Provider value={{ servicesEmp, setServicesEmp }}>
      {children}
    </EmployeeServicesContext.Provider>
  );
};
