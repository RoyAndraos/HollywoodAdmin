import { createContext, useState } from "react";

export const TextContext = createContext("");
// handles text to be loaded on the client side website
export const TextProvider = ({ children }) => {
  const [text, setText] = useState();
  return (
    <TextContext.Provider value={{ text, setText }}>
      {children}
    </TextContext.Provider>
  );
};
