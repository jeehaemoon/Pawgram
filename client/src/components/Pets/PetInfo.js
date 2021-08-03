import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { UserContext } from "../UserContext";

const PetInfo = () => {
  const { token, setUser } = useContext(UserContext);
  const [breedInfo, setBreedInfo] = useState(undefined);
  const [breedStatus, setBreedStatus] = useState("loading");
  const [tabType, setTabType] = React.useState("breedinfo");
  const { _id } = useParams();

  useEffect(() => {
    fetch("/profile", {
      method: "GET",
      headers: { "auth-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser(data);
      });
  }, [token]);

  useEffect(() => {
    fetch(`/pet/${_id}`, {
      method: "GET",
      headers: { "auth-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBreedInfo(data.data);
        setBreedStatus("idle");
      });
  }, []);

  const showBreed = () => {
    setTabType("breedinfo");
  };
  const showRandom = () => {
    setTabType("random");
  };

  return (
    <Container>
      {breedStatus === "loading" ? (
        <div>Loading...</div>
      ) : (
        <Wrapper>
          <div>
            <div>{breedInfo.name}</div>
            <div>{breedInfo.type}</div>
            <div>{breedInfo.age}</div>
            <div>{breedInfo.gender}</div>
            <div>{breedInfo.breed}</div>
          </div>
          <div>
            <Button onClick={showBreed}>Breed Info</Button>
            <Button onClick={showRandom}>Random Fact</Button>
          </div>
          {tabType === "breedinfo" ? (
            <div>
              <div>{breedInfo.info[0].name}</div>
              <div>Breed Group:{breedInfo.info[0].breed_group}</div>
              <div>Bred for:{breedInfo.info[0].bred_for}</div>
              <div>Height: {breedInfo.info[0].height.metric} cm</div>
              <div>Weight: {breedInfo.info[0].weight.metric}kg </div>
            </div>
          ) : tabType === "random" ? (
            <div>Random</div>
          ) : null}
        </Wrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 80vh;
  text-align: left;
`;

const Wrapper = styled.div`
  margin: 15vh 0px;
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  width: 600px;
  height: 600px;
  margin: 20vh auto;
  z-index: 5;
  background-color: white;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
`;

const Button = styled.button`
  width: 50%;
`;
export default PetInfo;
