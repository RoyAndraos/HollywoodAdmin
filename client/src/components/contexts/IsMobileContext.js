import { createContext, useState, useEffect } from "react";

export const IsMobileContext = createContext("");
// handles notifications to be loaded
export const IsMobileProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 1000;
      setIsMobile(newIsMobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);
  return (
    <IsMobileContext.Provider value={{ isMobile, setIsMobile }}>
      {children}
    </IsMobileContext.Provider>
  );
};
