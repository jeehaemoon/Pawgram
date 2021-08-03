import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useHistory, NavLink } from "react-router-dom";
import styled, { keyframes } from "styled-components";

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
      });
  }, [token]);

  console.log(token);

  // const submitImage = () => {
  //   console.log(file);
  //   const formData = new FormData();
  //   formData.append("productImage", file);
  //   fetch("/picture", {
  //     method: "POST",
  //     headers: { "auth-token": token },
  //     body: formData,
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //     });

  //   history.push("/");
  // };
  return (
    <Container>
      {/* <h1>Profile</h1>
      <form onSubmit={submitImage}>
        <input
          type="file"
          onChange={(ev) => {
            setFile(ev.target.files[0]);
          }}
        ></input>
        <button type="submit">Submit</button>
      </form> */}
      {petsStatus === "loading" ? (
        <div style={{ marginTop: "20vh" }}>Loading...</div>
      ) : user.pets.length === 0 ? (
        <NoPet>
          <Button onClick={() => history.push("/add-pet")}>Add Pet</Button>
          <Cat1 alt="cat" src="/assets/cat1.png" />
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
                    {pet.src === undefined && pet.type === "cat" ? (
                      <Img alt="cat" src="/assets/cat2.png" />
                    ) : pet.src === undefined && pet.type === "dog" ? (
                      <Img alt="cat" src="/assets/dog1.png" />
                    ) : (
                      <Img alt={pet.name} src={pet.src} />
                    )}
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

const Container = styled.div`
  height: 80vh;
  text-align: left;
`;

const NoPet = styled.div`
  margin: 15vh 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  margin: 15vh 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PetList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  margin-top: 20px;
  width: 1000px;
`;

const Cat1 = styled.img`
  width: 200px;
`;

const Pet = styled(NavLink)`
  width: 25%;
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

const ImageDiv = styled.div`
  width: fit-content;
  background-color: #fdfbc6;
  border-radius: 20px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(0, -20%);
`;
const Img = styled.img`
  width: 200px;
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
export default Pets;
