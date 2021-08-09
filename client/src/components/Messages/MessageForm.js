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
        <div>
          Play Date Invite{" "}
          <form>
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
            <button disabled={buttonState} onClick={handleSubmit}>
              Send
            </button>
          </form>
        </div>
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
export default MessageForm;
