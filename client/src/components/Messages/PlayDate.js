import React from "react";
import styled from "styled-components";

const PlayDate = ({ user }) => {
  return (
    <div>
      {user.playdate.map((date, index) => {
        return (
          <PlayDateDiv key={index}>
            <div>
              Play Date with <strong>{date.friend}</strong> on{" "}
              <strong>{date.date}</strong> at <strong>{date.time}</strong>
            </div>
            <TimeSent>{date.dateSent}</TimeSent>
          </PlayDateDiv>
        );
      })}
    </div>
  );
};

const PlayDateDiv = styled.div`
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

export default PlayDate;
