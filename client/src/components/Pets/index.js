import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useHistory, NavLink } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Loading from "../Loading";

const Pets = () => {
  const { token, setUser, user } = useContext(UserContext);
  const [petsStatus, setPetsStatus] = useState("loading");
  const [pets, setPets] = useState([]);
  // const [file, setFile] = useState("");
  const history = useHistory();
  useEffect(() => {
    fetch("/profile", {
      method: "GET",
      headers: { "auth-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser(data);
        setPetsStatus("idle");
        setPets(data.pets);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [token]);

  return (
    <Container>
      {petsStatus === "loading" ? (
        <LoadingDiv>
          <Loading />
        </LoadingDiv>
      ) : user.pets.length === 0 ? (
        <NoPet>
          <Button onClick={() => history.push("/add-pet")}>Add Pet</Button>
          <CatRolling>
            <Cat1 alt="cat" src="/assets/cat1.png" />
            <Yarn alt="yarn" src="/assets/yarn.png" />
          </CatRolling>
          You have no pets.
        </NoPet>
      ) : (
        <Wrapper>
          <Button onClick={() => history.push("/add-pet")}>Add Pet</Button>
          <PetList>
            {pets.map((pet, index) => {
              return (
                <Pet key={index} exact to={`/pets/${pet._id}`}>
                  <ImageDiv>
                    <Img alt={pet.name} src={pet.src} />
                  </ImageDiv>
                  <Name>{pet.name}</Name>
                  <Type>{pet.type}</Type>
                </Pet>
              );
            })}
          </PetList>
        </Wrapper>
      )}
    </Container>
  );
};

const rollingAnimation = keyframes`
  0%{
    transform: translate(0px) rotate(0deg);
  }
  50% {
    transform:translate(100px) rotate(360deg);
  }
  100%{
    transform: translate(0px) rotate(0deg);
  }

`;

const slideInAnimation = keyframes`
  0% {
    transform: translate(0px) ;
  }
  50% {
    transform:translate(100px) ;
  }
  100%{
    transform: translate(0px) ;

  }
`;

const Container = styled.div`
  margin: 15vh 0px;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NoPet = styled.div`
  max-width: 100vh;
  height: fit-content;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: larger;
`;

const Wrapper = styled.div`
  max-width: 100vh;
  height: fit-content;
  width: 90%;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
`;

const PetList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  margin-top: 10px;
`;

const Cat1 = styled.img`
  width: 200px;
  animation-name: ${slideInAnimation};
  animation-duration: 3s;
  animation-iteration-count: 1;
`;

const Yarn = styled.img`
  width: 50px;
  height: 50px;
  animation-name: ${rollingAnimation};
  animation-duration: 3s;
  animation-iteration-count: 1;
`;

const Pet = styled(NavLink)`
  width: 35%;
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

  @media (max-width: 500px) {
    width: 80%;
  }
`;

const Button = styled.button`
  width: 20%;
  margin: 0px auto;
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

  @media (max-width: 685px) {
    width: fit-content;
  }
`;

const ImageDiv = styled.div`
  width: 80%;
  background-color: #fdfbc6;
  border-radius: 20px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(0, -20%);
`;
const Img = styled.img`
  width: 80%;
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

const CatRolling = styled.div`
  display: flex;
  justify-content: baseline;
  align-items: baseline;
  margin-top: 100px;
`;

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20vh;
`;
export default Pets;
