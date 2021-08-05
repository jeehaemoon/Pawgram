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
      <SearchBar />
      <Wrapper>
        {userStatus === "loading" ? (
          <LoadingDiv>
            <Loading />
          </LoadingDiv>
        ) : user.friends.length === 0 ? (
          <NoFriendDiv>
            <DogPic alt="dog" src="/assets/dog2.png" />
          </NoFriendDiv>
        ) : (
          <FriendsWrapper>
            {user.friends.map((friend, index) => {
              return (
                <FriendLink key={index} exact to={`/friends/${friend._id}`}>
                  @{friend.username}
                </FriendLink>
              );
            })}
          </FriendsWrapper>
        )}
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  margin: 15vh 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  margin: 5vh auto;
  max-width: 100vh;
  height: 60vh;
  width: 90%;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
`;

const FriendsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
`;
const LoadingDiv = styled.div`
  margin-top: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const NoFriendDiv = styled.div`
  margin: 5vh auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FriendLink = styled(NavLink)`
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  border-radius: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
  text-decoration: none;
  color: black;
`;

const DogPic = styled.img`
  width: 300px;
`;
export default Friends;
