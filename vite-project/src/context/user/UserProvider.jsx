// src/contexts/user/UserProvider.jsx
import { useState, useEffect } from "react";
import { UserStateContext } from "./UserStateContext";
import { UserDispatchContext } from "./UserDispatchContext";
import apiClient from "../../api/client";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/api/auth/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsUserLoading(false);
      });
  }, []);

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  if (isUserLoading) return null;

  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={updateUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};
