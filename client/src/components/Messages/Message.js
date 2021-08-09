import React from "react";
import styled from "styled-components";

const Message = ({ user, handleSubmitMessage }) => {
  return (
    <div>
      {user.messages.map((message, index) => {
        return (
          <MessageDiv key={index}>
            <div>
              Play Date invitation from <strong>{message.username}</strong> on{" "}
              <strong>{message.date}</strong> at <strong>{message.time}</strong>
              ?
            </div>
            {message.accepted !== undefined ? (
              <div>Refused</div>
            ) : (
              <div>
                <Button
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
                </Button>
                <Button
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
                </Button>
              </div>
            )}
            <TimeSent>{message.dateSent}</TimeSent>
          </MessageDiv>
        );
      })}
    </div>
  );
};

const MessageDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-bottom: 2px dotted #56acf5;
`;

const TimeSent = styled.div`
  font-size: smaller;
  color: gray;
`;

const Button = styled.button`
  border: 1px solid black;
  margin-right: 5px;
  background-color: white;
  :active {
    -webkit-box-shadow: inset 0px 0px 5px #c1c1c1;
    -moz-box-shadow: inset 0px 0px 5px #c1c1c1;
    box-shadow: inset 0px 0px 5px #c1c1c1;
    outline: none;
  }
`;
export default Message;
