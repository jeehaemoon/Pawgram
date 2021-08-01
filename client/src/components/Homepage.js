import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router-dom";

const Homepage = () => {
  const { setToken, token } = useContext(UserContext);
  const history = useHistory();

  const handleLogIn = () => {
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "g",
        email: "h.moon@gmail.com",
        password: "123",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      });
    history.push("/profile");
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
  };
  const [picture, setPicture] = useState(undefined);
  const [pictureStatus, setPictureStatus] = useState("loading");

  // useEffect(() => {
  //   fetch("/picture", {
  //     method: "GET",
  //     headers: { "auth-token": token },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       setPicture(data.data[0].album);
  //       setPictureStatus("idle");
  //     });
  // }, []);
  // console.log(picture);
  return (
    <div>
      {token === null ? (
        <button onClick={() => handleLogIn()}>SignIn</button>
      ) : (
        <button onClick={() => handleLogOut()}>Signout</button>
      )}
      {pictureStatus === "loading" ? (
        <div></div>
      ) : (
        picture.map((item, index) => {
          return <img alt="pic" src={item.src} />;
        })
      )}
    </div>
  );
};

export default Homepage;
