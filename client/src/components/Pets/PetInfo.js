import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import Input from "../Input";
import Loading from "../Loading";

const PetInfo = () => {
  const { token, setUser, user } = useContext(UserContext);
  const [breedInfo, setBreedInfo] = useState(undefined);
  const [breedStatus, setBreedStatus] = useState("loading");
  const [tabType, setTabType] = React.useState("breedinfo");
  const [fact, setFact] = useState(undefined);
  const [factStatus, setFactStatus] = useState("loading");
  const [userStatus, setUserStatus] = useState("loading");
  const [formData, setFormData] = useState(undefined);
  const { _id } = useParams();
  const history = useHistory();

  const handleChange = (val, item) => {
    setFormData({ ...formData, [item]: val });
  };

  //fetch profile and store token
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

  //fetch pet info from the id
  useEffect(() => {
    fetch(`/pet/${_id}`, {
      method: "GET",
      headers: { "auth-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        setBreedInfo(data.data);
        setBreedStatus("idle");
        setFormData({
          _id: data.data._id,
          name: data.data.name,
          type: data.data.type,
          age: data.data.age,
          breed: data.data.breed,
          gender: data.data.gender,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  //fetch the dog or cat fact
  useEffect(() => {
    if (breedInfo !== undefined) {
      if (breedInfo.type === "dog") {
        fetch("/facts/dog", {
          method: "GET",
          headers: { "auth-token": token },
        })
          .then((res) => res.json())
          .then((data) => {
            setFact(data.data);
            setFactStatus("idle");
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        fetch("/facts/cat", {
          method: "GET",
          headers: { "auth-token": token },
        })
          .then((res) => res.json())
          .then((data) => {
            setFact(data.data);
            setFactStatus("idle");
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [breedInfo]);

  const showBreed = () => {
    setTabType("breedinfo");
  };
  const showRandom = () => {
    setTabType("random");
  };

  // function to  delete pet

  const handleDelete = () => {
    fetch("/pet/delete", {
      method: "PUT",
      headers: { "auth-token": token, "Content-Type": "application/json" },
      body: JSON.stringify({ _id: _id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          history.push("/pets");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //function when pet info is edited

  const handleEdit = () => {
    fetch("/pet/edit", {
      method: "PUT",
      headers: { "auth-token": token, "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          history.push("/pets");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Container>
      {breedStatus === "loading" ||
      userStatus === "loading" ||
      formData === undefined ||
      breedInfo === undefined ? (
        <LoadingDiv>
          <Loading />
        </LoadingDiv>
      ) : (
        <Wrapper>
          <PetDiv>
            <Img alt={breedInfo.name} src={breedInfo.src} />

            {breedInfo.owner === user.username ? (
              <Info>
                <div>
                  <span>Name: </span>
                  <Input
                    type="text"
                    name="name"
                    placeholder={formData.name}
                    handleChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <span>Type: </span>
                  {breedInfo.type}{" "}
                </div>
                <div>
                  <span>Age: </span>
                  <Age
                    type="number"
                    name="age"
                    placeholder="Age"
                    onChange={(ev) => handleChange(ev.target.value, "age")}
                    value={formData.age}
                    min="0"
                    max="30"
                    required
                  />
                  year(s) Old
                </div>
                <div>
                  <span>Gender: </span>
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={(ev) => handleChange(ev.target.value, "gender")}
                  />
                  <label htmlFor="cat">Female</label>
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={(ev) => handleChange(ev.target.value, "gender")}
                  />
                  <label htmlFor="dog">Male</label>
                </div>
                <div>
                  <span>Breed: </span>
                  {breedInfo.breed}
                </div>
                <EditButton onClick={() => handleEdit()}>Edit Info</EditButton>
              </Info>
            ) : (
              <Info>
                <div>
                  <span>Name: </span>
                  {breedInfo.name}
                </div>
                <div>
                  <span>Type: </span>
                  {breedInfo.type}
                </div>
                <div>
                  <span>Age: </span>
                  {breedInfo.age}
                  year(s) Old
                </div>
                <div>
                  <span>Gender: </span>
                  {breedInfo.gender}
                </div>
                <div>
                  <span>Breed: </span>
                  {breedInfo.breed}
                </div>
              </Info>
            )}
          </PetDiv>
          <div>
            <Button onClick={showBreed}>Breed Info</Button>
            <Button onClick={showRandom}>Random Fact</Button>
          </div>
          {tabType === "breedinfo" ? (
            <BreedInfo>
              <BreedImg alt="image" src={breedInfo.info[0].image.url} />
              <BreedName>{breedInfo.info[0].name}</BreedName>

              {breedInfo.type === "dog" ? (
                <div>
                  <div>
                    <span>Breed Group: </span>
                    {breedInfo.info[0].breed_group}
                  </div>
                  <div>
                    <span>Bred for: </span>
                    {breedInfo.info[0].bred_for}
                  </div>
                  <div>
                    <span>Height:</span> {breedInfo.info[0].height.metric} cm
                  </div>
                </div>
              ) : (
                <div>
                  <span>Origin:</span> {breedInfo.info[0].origin}
                </div>
              )}
              <div>
                <span>Weight:</span> {breedInfo.info[0].weight.metric}kg{" "}
              </div>
              <div>
                <span>Lifespan:</span> {breedInfo.info[0].life_span}
              </div>
              <div>
                <span>Temperament:</span> {breedInfo.info[0].temperament}
              </div>
            </BreedInfo>
          ) : tabType === "random" &&
            factStatus === "idle" &&
            breedInfo.type === "dog" ? (
            <RandomFact>{fact[0]}</RandomFact>
          ) : tabType === "random" &&
            factStatus === "idle" &&
            breedInfo.type === "cat" ? (
            <RandomFact>{fact}</RandomFact>
          ) : tabType === "random" && factStatus === "loading" ? (
            <div>Loading...</div>
          ) : null}
          {breedInfo.owner === user.username ? (
            <DeleteButton onClick={() => handleDelete()}>
              Remove Pet
            </DeleteButton>
          ) : null}
        </Wrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  text-align: left;
`;

const Wrapper = styled.div`
  margin: 15vh auto;
  display: flex;
  flex-direction: column;
  width: 600px;
  padding: 20px;
  height: fit-content;
  z-index: 5;
  background-color: white;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
`;

const BreedInfo = styled.div`
  margin-left: 40px;
  margin-right: 40px;
  span {
    font-weight: bolder;
  }
`;

const PetDiv = styled.div`
  margin-left: 40px;
  margin-right: 40px;
  display: flex;
  span {
    font-weight: bolder;
  }
`;

const Button = styled.button`
  width: 50%;
  border: none;
  border-bottom: 1px solid black;
  background-color: white;
  font-weight: bold;
  padding: 5px;
  margin-top: 10px;
  :focus,
  :hover {
    color: #56acf5;
    border-bottom: 2px solid #56acf5;
  }
`;

const Img = styled.img`
  width: 50%;
  margin-right: 10px;
`;

const BreedName = styled.div`
  margin-bottom: 5px;
  font-size: xx-large;
  border-bottom: 1px solid black;
`;

const Info = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
`;

const BreedImg = styled.img`
  width: 90%;
  margin-top: 10px;
  margin-left: 20px;
`;

const RandomFact = styled.div`
  text-align: center;
  margin: 50px 40px;
`;

const DeleteButton = styled.button`
  width: 30%;
  z-index: 5;
  margin: 0px auto;
  margin-top: 20px;
  background-color: white;
  color: #e93737;
  font-weight: bold;
  padding: 5px;
  font-size: 18px;
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

const EditButton = styled.button`
  width: 40%;
  margin: 10px auto;
  z-index: 5;
  background-color: white;
  color: black;
  font-weight: bold;
  padding: 5px;
  font-size: 12px;
  box-shadow: 3px -3px black, 2px -2px black, 1px -1px black;
  border-radius: 25px;
  border: 1px solid black;
  :active {
    -webkit-box-shadow: inset 0px 0px 5px #c1c1c1;
    -moz-box-shadow: inset 0px 0px 5px #c1c1c1;
    box-shadow: inset 0px 0px 5px #c1c1c1;
    outline: none;
  }
`;

const Cat = styled.input``;

const Dog = styled.input`
  margin-left: 10px;
`;

const Age = styled.input`
  margin-right: 10px;
`;

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;
export default PetInfo;
