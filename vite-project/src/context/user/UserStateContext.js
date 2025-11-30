import { createContext, useContext } from "react";

export const UserStateContext = createContext(null);

export const useUserState = () => {
  const context = useContext(UserStateContext);
  if (!context) {
    throw new Error("useUserState를 사용하려면 반드시 UserProvider로 감싸져 있어야 합니다.");
  }
  return context;
};