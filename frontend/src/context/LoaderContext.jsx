import React, { createContext, useContext, useState } from "react";

const LoaderContext = createContext(null);

export function LoaderProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) {
    throw new Error("useLoader must be used within LoaderProvider");
  }
  return ctx;
}
