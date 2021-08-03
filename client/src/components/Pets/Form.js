import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { NavLink, useHistory } from "react-router-dom";
import { ReactComponent as SVG3 } from "../../svg/vector-1-3.svg";
import { ReactComponent as SVG4 } from "../../svg/vector-1-4.svg";
import { UserContext } from "../UserContext";
import Input from "../Input";

const { v4: uuidv4 } = require("uuid");

const initialState = {
  _id: "",
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
  const _id = uuidv4();

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
        });
    }
  }, [formData.type]);

  console.log(formData);
  const handleChange = (val, item) => {
    setFormData({ ...formData, [item]: val });
  };

  const handleSubmit = () => {};
  return (
    <Container>
      <PetForm id="petForm">
        <Title>Add Pet</Title>
        <div>
          <input
            type="radio"
            id="cat"
            name="type"
            value="cat"
            onChange={(ev) => handleChange(ev.target.value, "type")}
          />
          <label htmlFor="cat">Cat</label>
          <input
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
            <select>
              <option></option>
            </select>
          ) : (
            <select
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
            </select>
          )}
        </Breed>
        <Input />
        <Input />
        <Input />
        <button>Submit</button>
      </PetForm>

      <div
        style={{
          position: "absolute",
          left: "0px",
          top: "0px",
          borderRadius: "50%",
          overflow: "hidden",
          display: "block",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <SVG3 style={{ display: "block" }} />
      </div>

      <div
        style={{
          position: "absolute",
          right: "0px",
          bottom: "0px",
          borderRadius: "50%",
          overflow: "hidden",
          display: "block",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <SVG4 style={{ display: "block" }} />
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 80vh;
  text-align: left;
`;

const PetForm = styled.form`
  padding: 40px;
  width: fit-content;
  margin: 20vh auto;
  z-index: 5;
  background-color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
`;

const Title = styled.p`
  font-size: 38px;
  font-weight: bold;
`;

const Breed = styled.div`
  width: 200px;
  select {
    width: 100%;
  }
`;

export default Form;
