import { createContext, useState } from "react";

export const ImageContext = createContext("");
// handles images to be loaded on the client side website
export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  return (
    <ImageContext.Provider value={{ images, setImages }}>
      {children}
    </ImageContext.Provider>
  );
};
