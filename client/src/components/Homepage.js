import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router-dom";
import { ReactComponent as SVG1 } from "../svg/vector-1-1.svg";
import { ReactComponent as SVG2 } from "../svg/vector-1-2.svg";

import styled from "styled-components";

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

    console.log(token);
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
    // <div style={{ marginTop: "15vh" }}>
    //   {token === null ? (
    //     <button
    //       onClick={() => {
    //         handleLogIn();
    //       }}
    //     >
    //       SignIn
    //     </button>
    //   ) : (
    //     <button onClick={() => handleLogOut()}>Signout</button>
    //   )}
    //   {pictureStatus === "loading" ? (
    //     <div></div>
    //   ) : (
    //     picture.map((item, index) => {
    //       return <img alt="pic" src={item.src} />;
    //     })
    //   )}
    // </div>
    <Container>
      <Wrapper>
        <Title>My Pet App</Title>
        <Info>Something something something</Info>
        <Button
          onClick={() => {
            history.push("/signup");
          }}
        >
          Get Started
        </Button>
      </Wrapper>
      <div
        style={{
          position: "absolute",
          right: "0px",
          bottom: "0px",
          borderRadius: "50%",
          overflow: "hidden",
          display: "block",
          pointerEvents: "none",
        }}
      >
        <SVG1 style={{ display: "block" }} />
      </div>
      <SVG2 style={{ position: "absolute", left: "0px", bottom: "0px" }} />
      <Cat1 alt="cat1" src="/assets/cat1.png" />
      <Cat2 alt="cat2" src="/assets/cat2.png" />
      <Plant1 alt="plant1" src="/assets/plant1.png" />
      <Plant2 alt="plant2" src="/assets/plant2.png" />
      <Dog1 alt="dog1" src="/assets/dog1.png" />
      <Plant3 alt="plant3" src="/assets/plant3.png" />
    </Container>
  );
};

const Container = styled.div`
  height: 80vh;
  text-align: center;
`;

const Wrapper = styled.div`
  padding: 20px;
  width: fit-content;
  margin: 20vh auto;
  z-index: 5;
`;

const Title = styled.p`
  font-size: 72px;
  font-weight: bold;
`;

const Info = styled.p`
  font: 42px;
`;

const Button = styled.button`
  margin-top: 50px;
  font-size: large;
  font-weight: bold;
  background-color: white;
  padding: 10px 20px;
  border-radius: 25px;
  z-index: 5;
  box-shadow: 3px -3px black, 2px -2px black, 1px -1px black;
  border: 1px solid black;
  :active {
    -webkit-box-shadow: inset 0px 0px 5px #c1c1c1;
    -moz-box-shadow: inset 0px 0px 5px #c1c1c1;
    box-shadow: inset 0px 0px 5px #c1c1c1;
    outline: none;
  }
`;
const Cat1 = styled.img`
  width: 300px;
  z-index: 3;
  position: absolute;
  bottom: 0;
  left: 100px;
`;

const Cat2 = styled.img`
  width: 300px;
  z-index: 3;
  position: absolute;
  bottom: 0px;
  left: 400px;
`;

const Plant1 = styled.img`
  height: 200px;
  z-index: 3;
  position: absolute;
  bottom: 0px;
  left: 650px;
`;

const Plant2 = styled.img`
  height: 300px;
  z-index: 3;
  position: absolute;
  bottom: 0px;
  left: 700px;
  z-index: 1;
`;
const Dog1 = styled.img`
  width: 400px;
  z-index: 3;
  position: absolute;
  bottom: 0px;
  left: 850px;
`;

const Plant3 = styled.img`
  height: 500px;
  z-index: 3;
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 1;
`;
export default Homepage;
