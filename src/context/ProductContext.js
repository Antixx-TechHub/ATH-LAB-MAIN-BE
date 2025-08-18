// src/context/ProductContext.js
"use client";
import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
   const [selectedDomains, setSelectedDomains] = useState(['All']);
     const [availableDomains, setAvailableDomains] = useState([]);


  return (
    <ProductContext.Provider
      value={{
       selectedDomains,
        setSelectedDomains,
        availableDomains,
        setAvailableDomains,

      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

