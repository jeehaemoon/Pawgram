import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import { useHistory } from "react-router-dom";
import Loading from "../Loading";

const initialState = { date: "", time: "" };

const MessageForm = () => {
  const { token, setUser, user } = useContext(UserContext);
  const [userStatus, setUserStatus] = useState("loading");
  const [formData, setFormData] = useState(initialState);
  const [buttonState, setButtonState] = useState(true);
  const { _id } = useParams();
  const history = useHistory();

  useEffect(() => {
    fetch("/profile", {
      method: "GET",
      headers: { "auth-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setUserStatus("idle");
      })
      .catch((err) => {
        console.error(err);
      });
  }, [token]);

  // set button state
  useEffect(() => {
    if (formData.time === "" || formData.date === "") {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
  }, [formData]);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log(formData);

    fetch(`/messages-to/${_id}`, {
      method: "POST",
      headers: { "auth-token": token, "Content-Type": "application/json" },
      body: JSON.stringify({
        date: formData.date,
        time: formData.time,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          window.alert("Play Date Sent.");
          history.push("/friends");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //set form data
  const handleChange = (val, item) => {
    setFormData({ ...formData, [item]: val });
  };
  console.log(formData);
  return (
    <Container>
      {userStatus === "loading" ? (
        <LoadingDiv>
          <Loading />
        </LoadingDiv>
      ) : (
        <Form>
          <div>
            <Title> Play Date Invite </Title>
            Would you like to go on a Play Date:
            <div>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                onChange={(ev) => handleChange(ev.target.value, "date")}
              />{" "}
              at{" "}
              <input
                type="time"
                onChange={(ev) => handleChange(ev.target.value, "time")}
              />
            </div>
            <Button disabled={buttonState} onClick={handleSubmit}>
              Send
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin: 15vh 0px;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30vh;
`;

const Form = styled.form`
  padding: 40px;
  width: fit-content;
  margin: 5vh auto;
  z-index: 5;
  background-color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
  background-image: repeating-linear-gradient(
    135deg,
    #f29b91 0px,
    #f09290 30px,
    transparent 30px,
    transparent 50px,
    #83b3db 50px,
    #84adcb 80px,
    transparent 80px,
    transparent 100px
  );

  div {
    background: white;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 30px 40px;
  }

  input {
    margin: 10px 0px 20px 0px;
  }
`;

const Title = styled.p`
  font-size: 38px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: fit-content;
  z-index: 5;
  margin: 0px auto;
  margin-top: 10px;
  background-color: white;
  color: black;
  font-weight: bold;
  padding: 5px 20px;
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
export default MessageForm;
