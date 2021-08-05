import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import { NavLink } from "react-router-dom";
import SearchBar from "../SearchBar";
import Loading from "../Loading";

const Friends = () => {
  const { setUser, user, token } = useContext(UserContext);
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
  return (
    <Container>
      <Wrapper>
        <SearchBar />

        {userStatus === "loading" ? (
          <LoadingDiv>
            <Loading />
          </LoadingDiv>
        ) : user.friends.length === 0 ? (
          <div>No Friends</div>
        ) : (
          <FriendsWrapper>
            {user.friends.map((friend, index) => {
              return (
                <NavLink key={index} exact to={`/friends/${friend._id}`}>
                  {friend.username}
                </NavLink>
              );
            })}
          </FriendsWrapper>
        )}
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  height: 80vh;
  text-align: left;
`;
const Wrapper = styled.div`
  margin: 15vh 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoadingDiv = styled.div`
  margin-top: 30vh;
`;

const FriendsWrapper = styled.div``;
export default Friends;
