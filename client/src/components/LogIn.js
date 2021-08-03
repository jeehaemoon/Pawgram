import React, { useEffect, useState, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import styled from "styled-components";
import Input from "./Input";
import { UserContext } from "./UserContext";
import { ReactComponent as SVG3 } from "../svg/vector-1-3.svg";
import { ReactComponent as SVG4 } from "../svg/vector-1-4.svg";

const initialState = {
  username: "",
  email: "",
  password: "",
};

const LogIn = () => {
  const history = useHistory();

  const [formData, setFormData] = useState(initialState);
  const [buttonState, setButtonState] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const { setToken } = useContext(UserContext);

  const handleChange = (val, item) => {
    setFormData({ ...formData, [item]: val });
  };

  useEffect(() => {
    if (
      formData.username === "" ||
      formData.email === "" ||
      formData.password === ""
    ) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
  }, [formData]);

  const validateEmail = () => {
    const emailParts = formData.email.split("@");
    return (
      emailParts.length === 2 &&
      emailParts[0].length > 0 &&
      emailParts[1].length > 0
    );
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setPasswordCorrect(false);
    setUserExists(false);

    if (validateEmail()) {
      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.message === "Wrong password.") {
            setPasswordCorrect(true);
          } else if (data.message === "User does not exist.") {
            setUserExists(true);
          } else {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            history.push("/pets");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <Container>
      <Form id="loginForm">
        <Title>Log In</Title>
        <Text>
          Don't have an account?
          <NavLinkItem exact to="/signup">
            Sign Up
          </NavLinkItem>
        </Text>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          handleChange={handleChange}
          value={formData.username}
          required
        />
        <Input
          type="text"
          name="email"
          placeholder="Email"
          required
          handleChange={handleChange}
          value={formData.email}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
          handleChange={handleChange}
          value={formData.password}
        />
        <Button disabled={buttonState} onClick={handleSubmit}>
          Submit
        </Button>
        {passwordCorrect ? (
          <Warning>Incorrect Password</Warning>
        ) : userExists ? (
          <Warning>User does not exist. Go to the Sign Up page.</Warning>
        ) : null}
      </Form>

      <div
        style={{
          position: "absolute",
          left: "0px",
          top: "0px",
          borderRadius: "50%",
          overflow: "hidden",
          display: "block",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <SVG3 style={{ display: "block" }} />
      </div>

      <div
        style={{
          position: "absolute",
          right: "0px",
          bottom: "0px",
          borderRadius: "50%",
          overflow: "hidden",
          display: "block",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <SVG4 style={{ display: "block" }} />
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 80vh;
  text-align: left;
`;

const Form = styled.form`
  padding: 40px;
  width: fit-content;
  margin: 20vh auto;
  z-index: 5;
  background-color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
  input {
    margin-bottom: 25px;
    width: 400px;
    padding: 5px 10px;
    border-radius: 20px;
    border: 1px solid black;
    font-weight: bold;
    ::-webkit-input-placeholder {
      color: black;
      font-weight: bold;
    }
  }
`;

const Title = styled.p`
  font-size: 38px;
  font-weight: bold;
`;

const Button = styled.button`
  width: 30%;
  z-index: 5;
  margin: 0px auto;
  background-color: white;
  color: black;
  font-weight: bold;
  padding: 5px;
  font-size: 18px;
  box-shadow: 3px -3px black, 2px -2px black, 1px -1px black;
  border-radius: 25px;
  border: 1px solid black;
  :active {
    -webkit-box-shadow: inset 0px 0px 5px #c1c1c1;
    -moz-box-shadow: inset 0px 0px 5px #c1c1c1;
    box-shadow: inset 0px 0px 5px #c1c1c1;
    outline: none;
  }
  :disabled {
    opacity: 0.5;
  }
`;

const NavLinkItem = styled(NavLink)`
  color: #56acf5;
  margin-left: 5px;
`;

const Text = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  color: gray;
  font-weight: bold;
  font-size: smaller;
`;

const Warning = styled.div`
  margin: 0px auto;
  margin-top: 30px;
  color: #fc7750;
  font-weight: bold;
`;
export default LogIn;
