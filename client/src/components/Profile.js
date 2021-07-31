import React, { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

const Profile = () => {
  const { token, setUser, user } = useContext(UserContext);
  console.log(token);
  useEffect(() => {
    fetch("/profile", {
      method: "GET",
      headers: { "auth-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  }, []);

  console.log(user);
  return <div>Profile</div>;
};

export default Profile;
