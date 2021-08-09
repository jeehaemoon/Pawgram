import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import { useHistory } from "react-router-dom";
import Loading from "../Loading";

const Messages = () => {
  const { token, setUser, user } = useContext(UserContext);
  const [userStatus, setUserStatus] = useState("loading");

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
        if (data.status === 200) {
        }
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
        <div>
          <div>No Play Date</div>
          <div>No messages</div>
        </div>
      ) : user.playdate.length === 0 && user.messages.length !== 0 ? (
        <div>
          <div>No Play Dates</div>
          <div>
            {user.messages.map((message, index) => {
              return (
                <div key={index}>
                  <div>Play Date from {message.username}</div>
                  <div>
                    Would you like to go on a Play Date: {message.date} at{" "}
                    {message.time}?
                  </div>
                  {message.accepted !== undefined ? (
                    <div>Date refused</div>
                  ) : (
                    <div>
                      <button
                        onClick={() =>
                          handleSubmitMessage(
                            message._id,
                            message.username,
                            message.author,
                            message.date,
                            message.time,
                            true
                          )
                        }
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleSubmitMessage(
                            message._id,
                            message.username,
                            message.author,
                            message.date,
                            message.time,
                            false
                          )
                        }
                      >
                        Refuse
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : user.playdate.length !== 0 && user.messages.length === 0 ? (
        <div>
          <div>
            {user.playdate.map((date, index) => {
              return (
                <div key={index}>
                  <div>
                    Play Date with {date.friend} on {date.time} at {date.date}
                  </div>
                </div>
              );
            })}
          </div>
          <div>No messages</div>
        </div>
      ) : (
        <div>
          <div>
            {" "}
            {user.playdate.map((date, index) => {
              return (
                <div key={index}>
                  <div>
                    Play Date with {date.friend} on {date.time} at {date.date}
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            {" "}
            {user.messages.map((message, index) => {
              return (
                <div key={index}>
                  <div>Play Date from {message.username}</div>
                  <div>
                    Would you like to go on a Play Date: {message.date} at{" "}
                    {message.time}?
                  </div>
                  {message.accepted !== undefined ? (
                    <div>Date refused</div>
                  ) : (
                    <div>
                      <button
                        onClick={() =>
                          handleSubmitMessage(
                            message._id,
                            message.username,
                            message.author,
                            message.date,
                            message.time,
                            true
                          )
                        }
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleSubmitMessage(
                            message._id,
                            message.username,
                            message.author,
                            message.date,
                            message.time,
                            false
                          )
                        }
                      >
                        Refuse
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
export default Messages;
