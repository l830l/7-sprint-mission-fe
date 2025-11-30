// src/contexts/user/UserProvider.jsx
import { useState } from "react";
import { UserStateContext } from "./UserStateContext";
import { UserDispatchContext } from "./UserDispatchContext";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
    sessionStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={updateUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};
