import React, { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import { NavLink } from "react-router-dom";
import SearchBar from "../SearchBar";
import Loading from "../Loading";

const Friends = () => {
  const { user, userStatus } = useContext(UserContext);
  // const [userStatus, setUserStatus] = useState("loading");

  // useEffect(() => {
  //   fetch("/profile", {
  //     method: "GET",
  //     headers: { "auth-token": token },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setUser(data);
  //       setUserStatus("idle");
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, [token]);
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
                  <ProfileDiv>
                    <img alt="collar" src="/assets/collar.png" />
                    <strong>{friend.username}</strong>
                  </ProfileDiv>
                  <FriendsDiv>Friends</FriendsDiv>
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
  width: 90%;
  height: 50px;
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 20px;
  border-radius: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
  text-decoration: none;
  color: black;

  :active {
    -webkit-box-shadow: inset 0px 0px 5px #e5e5e5;
    -moz-box-shadow: inset 0px 0px 5px #e5e5e5;
    box-shadow: inset 0px 0px 5px #e5e5e5;
    outline: none;
  }
`;

const DogPic = styled.img`
  width: 300px;
`;

const ProfileDiv = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 40px;
    margin-right: 10px;
  }
`;

const FriendsDiv = styled.div`
  background-color: #56acf5;
  color: white;
  font-weight: bold;
  border: none;
  width: fit-content;
  padding: 5px 20px;
  border-radius: 20px;
`;
export default Friends;
