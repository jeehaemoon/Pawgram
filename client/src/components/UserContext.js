import React, { useState, useEffect, createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const userToken = localStorage.getItem("token");
  const [newMessage, setNewMessage] = useState(false);

  const [token, setToken] = useState(userToken);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    setToken(userToken);
  }, [token]);

  return (
    <UserContext.Provider
      value={{ setToken, token, setUser, user, newMessage, setNewMessage }}
    >
      {children}
    </UserContext.Provider>
  );
};
