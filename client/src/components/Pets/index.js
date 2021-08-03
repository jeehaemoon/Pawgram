import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useHistory } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const Pets = () => {
  const { token, setUser, user } = useContext(UserContext);
  const [petsStatus, setPetsStatus] = useState("loading");
  // const [file, setFile] = useState("");
  const history = useHistory();
  useEffect(() => {
    fetch("/profile", {
      method: "GET",
      headers: { "auth-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser(data);
        setPetsStatus("idle");
      });
  }, [token]);

  console.log(token);

  // const submitImage = () => {
  //   console.log(file);
  //   const formData = new FormData();
  //   formData.append("productImage", file);
  //   fetch("/picture", {
  //     method: "POST",
  //     headers: { "auth-token": token },
  //     body: formData,
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //     });

  //   history.push("/");
  // };
  return (
    <Container>
      {/* <h1>Profile</h1>
      <form onSubmit={submitImage}>
        <input
          type="file"
          onChange={(ev) => {
            setFile(ev.target.files[0]);
          }}
        ></input>
        <button type="submit">Submit</button>
      </form> */}
      {petsStatus === "loading" ? (
        <div style={{ marginTop: "20vh" }}>Loading...</div>
      ) : user.pets.length === 0 ? (
        <NoPet>
          <button onClick={() => history.push("/add-pet")}>Add Pet</button>
          <Cat1 alt="cat" src="/assets/cat1.png" />
          You have no pets.
        </NoPet>
      ) : (
        <div>
          <button onClick={() => history.push("/add-pet")}>Add Pet</button>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 80vh;
  text-align: left;
`;

const NoPet = styled.div`
  margin: 20vh 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Cat1 = styled.img`
  width: 200px;
`;
export default Pets;
