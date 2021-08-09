import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { UserContext } from "../UserContext";
import { NavLink, useHistory } from "react-router-dom";
import styled from "styled-components";
import Loading from "../Loading";
import { FaRegPaperPlane } from "react-icons/fa";

const Friend = () => {
  const { token, setUser, user } = useContext(UserContext);
  const [userStatus, setUserStatus] = useState("loading");
  const [friendInfo, setFriendInfo] = useState(undefined);
  const [friendStatus, setFriendStatus] = useState("loading");
  const [tabType, setTabType] = React.useState("pets");
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

  //fetch user data

  useEffect(() => {
    fetch(`/users/${_id}`, {
      method: "GET",
      headers: { "auth-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        setFriendInfo(data.data);
        setFriendStatus("idle");
      })
      .catch((err) => {
        console.error(err);
      });
  }, [token, friendStatus]);

  // set tab
  const showPets = () => {
    setTabType("pets");
  };
  const showAlbum = () => {
    setTabType("album");
  };

  //function to add friend
  const addFriend = (username, id) => {
    fetch("/friends/add", {
      method: "POST",
      headers: { "auth-token": token, "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, username: username }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFriendStatus("added");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //function to delete friend
  const deleteFriend = (id) => {
    fetch("/friends/delete", {
      method: "PUT",
      headers: { "auth-token": token, "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFriendStatus("deleted");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Container>
      {userStatus === "loading" || friendStatus === "loading" ? (
        <LoadingDiv>
          <Loading />
        </LoadingDiv>
      ) : (
        <Wrapper>
          <Info>
            <h1>@{friendInfo.username}</h1>

            {friendInfo.friends.length === 0 ||
            friendInfo.friends.find((friend) => friend._id !== user._id) ? (
              <FriendButton
                onClick={() => addFriend(friendInfo.username, friendInfo._id)}
              >
                Add Friend
              </FriendButton>
            ) : (
              <ButtonDiv>
                <FriendButton disabled>Friends</FriendButton>
                <FaRegPaperPlane
                  style={{ cursor: "pointer" }}
                  onClick={() => history.push(`/send-message/${_id}`)}
                />
              </ButtonDiv>
            )}
          </Info>
          <div>
            <Button onClick={showPets}>Pets</Button>
            <Button onClick={showAlbum}>Album</Button>
          </div>
          {/* if pets display pets if not display no pet same for album */}
          {tabType === "pets" && friendInfo.pets.length !== 0 ? (
            <ItemsWrapper>
              {friendInfo.pets.map((pet, index) => {
                return (
                  <PetDiv key={index} exact to={`/pets/${pet._id}`}>
                    <ImageDiv>
                      <Img alt="image" src={"/" + pet.src} />
                    </ImageDiv>
                    <Name>{pet.name}</Name>
                    <Type>{pet.type}</Type>
                  </PetDiv>
                );
              })}
            </ItemsWrapper>
          ) : tabType === "pets" && friendInfo.pets.length === 0 ? (
            <div>No Pet</div>
          ) : tabType === "album" && friendInfo.album.length !== 0 ? (
            <ItemsWrapper>
              {friendInfo.album.map((picture, index) => {
                return (
                  <Picture key={index} exact to={`/pictures/${picture._id}`}>
                    <PictureImg alt="pic" src={"/" + picture.src} />
                  </Picture>
                );
              })}
            </ItemsWrapper>
          ) : tabType === "album" && friendInfo.album.length === 0 ? (
            <div>No Pictures</div>
          ) : null}

          {friendInfo.friends.length !== 0 ||
          friendInfo.friends.find((friend) => friend._id === user._id) ? (
            <RemoveFriendButton onClick={() => deleteFriend(friendInfo._id)}>
              Remove Friend
            </RemoveFriendButton>
          ) : null}
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
  margin-top: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
  max-width: 100vh;
  width: 90%;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
`;
const Button = styled.button`
  width: 50%;
  border: none;
  border-bottom: 1px solid black;
  background-color: white;
  font-weight: 500;
  font-size: medium;
  padding: 5px;
  margin-top: 10px;
  :focus,
  :hover {
    color: #56acf5;
    border-bottom: 2px solid #56acf5;
  }
`;
const ItemsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const PetDiv = styled(NavLink)`
  width: 30%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10vh;
  margin-right: 20px;
  border-radius: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
  text-decoration: none;
  color: black;
`;

const ImageDiv = styled.div`
  width: 80%;
  background-color: #fdfbc6;
  border-radius: 20px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(0, -20%);
`;

const Name = styled.div`
  font-weight: bold;
  font-size: x-large;
  transform: translate(0, -50%);
`;
const Type = styled.div`
  color: gray;
  transform: translate(0, -50%);
`;
const Img = styled.img`
  width: 100%;
`;

const Picture = styled(NavLink)`
  width: 50%;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px 0px;
`;

const PictureImg = styled.img`
  width: 100%;
`;

const FriendButton = styled.button`
  background-color: #56acf5;
  color: white;
  font-weight: bold;
  border: none;
  width: fit-content;
  padding: 10px 20px;
  border-radius: 20px;
  margin-right: 20px;
  :active {
    -webkit-box-shadow: inset 0px 0px 5px #e5e5e5;
    -moz-box-shadow: inset 0px 0px 5px #e5e5e5;
    box-shadow: inset 0px 0px 5px #e5e5e5;
    outline: none;
  }

  :disabled {
    opacity: 0.7;
  }
`;

const RemoveFriendButton = styled.button`
  width: 20%;
  z-index: 5;
  margin: 0px auto;
  margin-top: 20px;
  background-color: white;
  color: #e93737;
  font-weight: bold;
  padding: 5px;
  font-size: small;
  box-shadow: 3px -3px #e93737, 2px -2px #e93737, 1px -1px #e93737;
  border-radius: 25px;
  border: 1px solid #e93737;
  :active {
    -webkit-box-shadow: inset 0px 0px 5px #e93737;
    -moz-box-shadow: inset 0px 0px 5px #e93737;
    box-shadow: inset 0px 0px 5px #e93737;
    outline: none;
  }
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export default Friend;
