import React, { useContext, useEffect } from "react";
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
      });

    history.push("/profile");
  };
  console.log(token);

  const handleLogOut = () => {
    localStorage.removeItem("token");
  };
  return (
    <div>
      {token === null ? (
        <button onClick={() => handleLogIn()}>SignIn</button>
      ) : (
        <button onClick={() => handleLogOut()}>Signout</button>
      )}
    </div>
  );
};

export default Homepage;
