import React, { useState, useEffect, createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const userToken = localStorage.getItem("token");
  const [newMessage, setNewMessage] = useState(undefined);
  const [userStatus, setUserStatus] = useState("loading");
  const [picturePage, setPicturePage] = useState(undefined);
  const [token, setToken] = useState(userToken);
  const [user, setUser] = useState(undefined);
  const [albumStatus, setAlbumStatus] = useState("loading");
  const [pictures, setPictures] = useState(undefined);
  const [petsStatus, setPetsStatus] = useState("loading");
  const [pets, setPets] = useState([]);
  const [messageState, setMessageState] = useState(undefined);
  const [petPage, setPetPage] = useState(undefined);
  useEffect(() => {
    setToken(userToken);
  }, [token]);

  useEffect(() => {
    if (token !== null) {
      fetch("/profile", {
        method: "GET",
        headers: { "auth-token": token },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setUserStatus("idle");
          setPetsStatus("idle");
          setPets(data.pets);
          if (data.album.length !== 0) {
            setPictures(data.album);
            setAlbumStatus("idle");
          }
          if (data.album.length === 0) {
            setAlbumStatus("empty");
          }
          if (data.messages.length !== 0) {
            const filteredMessage = data.messages.filter((message) => {
              return message.accepted === undefined;
            });
            console.log(filteredMessage);
            if (filteredMessage.length !== 0) {
              setNewMessage(true);
            } else {
              setNewMessage(false);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [token, messageState, petPage, picturePage, messageState]);

  return (
    <UserContext.Provider
      value={{
        setToken,
        token,
        setUser,
        user,
        newMessage,
        setNewMessage,
        setUserStatus,
        userStatus,
        albumStatus,
        pictures,
        pets,
        petsStatus,
        messageState,
        setMessageState,
        setPicturePage,
        setPetPage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
