import { createContext, useContext } from "react";

export const UserDispatchContext = createContext(null);

export const useUserDispatch = () => {
  const context = useContext(UserDispatchContext);
  if (!context) {
    throw new Error("useUserDispatch must be used within UserProvider");
  }
  return context;
};