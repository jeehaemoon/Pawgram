import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { ReactComponent as SVG3 } from "../../svg/vector-1-3.svg";
import { UserContext } from "../UserContext";

const initialState = {
  type: "",
  breed: "",
  name: "",
  gender: "",
  age: "",
};

const Form = () => {
  const [formData, setFormData] = useState(initialState);
  const [petBreeds, setPetBreeds] = useState(undefined);
  const [breedState, setBreedState] = useState("loading");
  const [buttonState, setButtonState] = useState(true);
  const { token, setUser, user } = useContext(UserContext);
  const history = useHistory();
  const [file, setFile] = useState("");

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

  //retrieve breeds depending on the pet type selection
  useEffect(() => {
    if (formData.type === "dog") {
      fetch("/dogbreeds", {
        method: "GET",
        headers: { "auth-token": token },
      })
        .then((res) => res.json())
        .then((data) => {
          setPetBreeds(data.data);
          setBreedState("idle");
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (formData.type === "cat") {
      fetch("/catbreeds", {
        method: "GET",
        headers: { "auth-token": token },
      })
        .then((res) => res.json())
        .then((data) => {
          setPetBreeds(data.data);
          setBreedState("idle");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [formData.type]);
  const handleChange = (val, item) => {
    setFormData({ ...formData, [item]: val });
  };

  useEffect(() => {
    if (
      formData.name === "" ||
      formData.gender === "" ||
      formData.type === "" ||
      formData.age === "" ||
      formData.breed === "" ||
      file === undefined
    ) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
  }, [formData, file]);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log(formData);
    const data = new FormData();
    data.append("productImage", file);
    data.append("type", formData.type);
    data.append("gender", formData.gender);
    data.append("breed", formData.breed);
    data.append("name", formData.name);
    data.append("age", formData.age);

    fetch("/pet", {
      method: "POST",
      headers: { "auth-token": token },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
      <PetForm id="petForm">
        <Title>Add Pet</Title>
        <input
          type="file"
          onChange={(ev) => {
            setFile(ev.target.files[0]);
          }}
        ></input>
        <div>
          <Cat
            type="radio"
            id="cat"
            name="type"
            value="cat"
            onChange={(ev) => handleChange(ev.target.value, "type")}
          />
          <label htmlFor="cat">Cat</label>
          <Dog
            type="radio"
            id="dog"
            name="type"
            value="dog"
            onChange={(ev) => handleChange(ev.target.value, "type")}
          />
          <label htmlFor="dog">Dog</label>
        </div>
        <Breed>
          {breedState === "loading" ? (
            <Select>
              <option value="">Breed</option>
            </Select>
          ) : (
            <Select
              onFocus={(ev) => {
                ev.target.size = 3;
              }}
              onBlur={(ev) => {
                ev.target.size = 1;
              }}
              onChange={(ev) => {
                ev.target.size = 1;
                handleChange(ev.target.value, "breed");
              }}
            >
              {petBreeds.map((breed, index) => {
                return <option key={index}>{breed}</option>;
              })}
            </Select>
          )}
        </Breed>
        <Name
          type="text"
          name="name"
          placeholder="Name"
          onChange={(ev) => handleChange(ev.target.value, "name")}
          value={formData.name}
          required
        />
        <div>
          <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            onChange={(ev) => handleChange(ev.target.value, "gender")}
          />
          <label htmlFor="cat">Female</label>
          <input
            type="radio"
            id="male"
            name="gender"
            value="male"
            onChange={(ev) => handleChange(ev.target.value, "gender")}
          />
          <label htmlFor="dog">Male</label>
        </div>
        <div>
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
          <label htmlFor="age">Year(s) Old</label>
        </div>
        <Button disabled={buttonState} onClick={handleSubmit}>
          Submit
        </Button>
      </PetForm>
      <Dog1 alt="dog" src="/assets/dog1.png" />
      <Cat1 alt="cat" src="/assets/cat2.png" />
      <SVGDIV>
        <SVG3 style={{ display: "block" }} />
      </SVGDIV>
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

const PetForm = styled.form`
  padding: 40px;
  width: fit-content;
  margin: 5vh auto;
  z-index: 5;
  background-color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);

  input {
    margin-bottom: 20px;
  }

  select {
    margin-bottom: 20px;
  }
`;

const Title = styled.p`
  font-size: 38px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Breed = styled.div`
  width: 200px;
  select {
    width: 100%;
  }
`;

const Age = styled.input`
  width: 70px;
  margin-right: 10px;
  padding: 5px 10px;
`;

const Name = styled.input`
  width: 200px;
  padding: 5px 10px;
`;

const Select = styled.select`
  padding: 5px 10px;
`;

const Cat = styled.input``;

const Dog = styled.input`
  margin-left: 10px;
`;

const Dog1 = styled.img`
  position: absolute;
  bottom: 0px;
  right: 20%;
  width: 300px;

  @media (max-width: 1024px) {
    display: none;
  }
`;
const Cat1 = styled.img`
  position: absolute;
  bottom: 0px;
  left: 20%;
  width: 300px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Button = styled.button`
  width: 70%;
  z-index: 5;
  margin: 0px auto;
  margin-top: 10px;
  background-color: white;
  color: black;
  font-weight: bold;
  padding: 5px;
  font-size: 18px;
  box-shadow: 3px -3px black, 2px -2px black, 1px -1px black;
  border-radius: 25px;
  border: 1px solid black;
  :active {
    -webkit-box-shadow: inset 0px 0px 5px #c1c1c1;
    -moz-box-shadow: inset 0px 0px 5px #c1c1c1;
    box-shadow: inset 0px 0px 5px #c1c1c1;
    outline: none;
  }
  :disabled {
    opacity: 0.5;
  }
`;

const SVGDIV = styled.div`
  position: absolute;
  left: 20%;
  top: 0;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  pointer-events: none;
  z-index: -1;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export default Form;
