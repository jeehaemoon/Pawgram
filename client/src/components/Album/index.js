import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useHistory, NavLink } from "react-router-dom";
import styled from "styled-components";
import Loading from "../Loading";

const Album = () => {
  const { token, setUser } = useContext(UserContext);
  const [albumStatus, setAlbumStatus] = useState("loading");
  const [pictures, setPictures] = useState(undefined);
  const history = useHistory();

  useEffect(() => {
    fetch("/profile", {
      method: "GET",
      headers: { "auth-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.album);
        if (data.album.length !== 0) {
          setUser(data);
          setPictures(data.album);
          setAlbumStatus("idle");
        } else if (data.album.length === 0) {
          setAlbumStatus("empty");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [token]);

  return (
    <Container>
      {albumStatus === "loading" ? (
        <LoadingDiv>
          <Loading />
        </LoadingDiv>
      ) : albumStatus === "empty" ? (
        <NoPictures>
          <Button onClick={() => history.push("/add-picture")}>
            Add Picture
          </Button>
          No pictures
        </NoPictures>
      ) : albumStatus === "idle" ? (
        <Wrapper>
          <Button onClick={() => history.push("/add-picture")}>
            Add Picture
          </Button>
          <PictureList>
            {pictures.map((picture, index) => {
              return (
                <Picture key={index} exact to={`/pictures/${picture._id}`}>
                  <Img alt="pic" src={picture.src} />
                </Picture>
              );
            })}
          </PictureList>
        </Wrapper>
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  height: 80vh;
  text-align: left;
`;

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  margin-top: 20vh;
`;

const NoPictures = styled.div`
  margin: 15vh 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: larger;
`;
const Wrapper = styled.div`
  margin: 15vh 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const PictureList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  width: 1000px;
`;

const Button = styled.button`
  font-size: large;
  font-weight: bold;
  background-color: white;
  padding: 10px 20px;
  border-radius: 25px;
  z-index: 5;
  box-shadow: 3px -3px black, 2px -2px black, 1px -1px black;
  border: 1px solid black;
  :active {
    -webkit-box-shadow: inset 0px 0px 5px #c1c1c1;
    -moz-box-shadow: inset 0px 0px 5px #c1c1c1;
    box-shadow: inset 0px 0px 5px #c1c1c1;
    outline: none;
  }
`;

const Picture = styled(NavLink)`
  width: fit-content;
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

const Img = styled.img`
  width: 400px;
`;
export default Album;
