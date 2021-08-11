import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import Loading from "../Loading";
import PlayDate from "./PlayDate";
import Message from "./Message";

const Messages = () => {
  const {
    token,
    setUser,
    user,
    setNewMessage,
    userStatus,
    messageState,
    setMessageState,
  } = useContext(UserContext);
  // const [userStatus, setUserStatus] = useState("loading");
  // const [messageState, setMessageState] = useState(undefined);

  // useEffect(() => {
  //   fetch("/profile", {
  //     method: "GET",
  //     headers: { "auth-token": token },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setUser(data);
  //       setUserStatus("idle");
  //       if (data.messages.length !== 0) {
  //         const filteredMessage = data.messages.filter((message) => {
  //           return message.accepted === undefined;
  //         });
  //         console.log(filteredMessage);
  //         if (filteredMessage.length !== 0) {
  //           setNewMessage(true);
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, [token, messageState]);

  //function to reply to playdate

  const handleSubmitMessage = (
    messageId,
    friendUsername,
    friendId,
    date,
    time,
    accepted
  ) => {
    fetch(`/messages-reply/${messageId}`, {
      method: "POST",
      headers: { "auth-token": token, "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: messageId,
        friendId: friendId,
        friendUsername: friendUsername,
        date: date,
        time: time,
        accepted: accepted,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMessageState(data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Container>
      {userStatus === "loading" ? (
        <LoadingDiv>
          <Loading />
        </LoadingDiv>
      ) : user.messages.length === 0 && user.playdate.length === 0 ? (
        <Wrapper>
          <Div>
            <Title>Play Dates</Title>No Play Dates
          </Div>
          <Div>
            <Title>Messages</Title>No messages
          </Div>
        </Wrapper>
      ) : user.playdate.length === 0 && user.messages.length !== 0 ? (
        <Wrapper>
          <Div>
            <Title>Play Dates</Title>No Play Dates
          </Div>
          <Div>
            <Title>Messages</Title>
            <Message user={user} handleSubmitMessage={handleSubmitMessage} />
          </Div>
        </Wrapper>
      ) : user.playdate.length !== 0 && user.messages.length === 0 ? (
        <Wrapper>
          <Div>
            <Title>Play Dates</Title>
            <PlayDate user={user} />
          </Div>
          <Div>
            <Title>Messages</Title>No messages
          </Div>
        </Wrapper>
      ) : (
        <Wrapper>
          <Div>
            <Title>Play Dates</Title> <PlayDate user={user} />
          </Div>
          <Div>
            <Title>Messages</Title>{" "}
            <Message user={user} handleSubmitMessage={handleSubmitMessage} />
          </Div>
        </Wrapper>
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

const Wrapper = styled.div`
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
  max-width: 100vh;
  width: 90%;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
`;

const Div = styled.div`
  margin: 20px 0px;
`;

const Title = styled.h1`
  border-bottom: 1px solid black;
  margin-bottom: 10px;
`;

export default Messages;
