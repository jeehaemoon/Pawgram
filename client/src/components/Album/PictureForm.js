import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as SVG3 } from "../../svg/vector-1-3.svg";
import Loading from "../Loading";

const initialState = { note: "" };

const PictureForm = () => {
  const { token, albumStatus, setPicturePage } = useContext(UserContext);
  const [file, setFile] = useState("");
  // const [albumStatus, setAlbumStatus] = useState("loading");
  const [formData, setFormData] = useState(initialState);
  const [buttonState, setButtonState] = useState(true);
  const history = useHistory();

  //fetch profile token
  // useEffect(() => {
  //   fetch("/profile", {
  //     method: "GET",
  //     headers: { "auth-token": token },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setUser(data);
  //       setAlbumStatus("idle");
  //     });
  // }, [token]);

  // set button state
  useEffect(() => {
    if (formData.note === "" || file === undefined) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
  }, [formData, file]);

  //set form data
  const handleChange = (val, item) => {
    setFormData({ ...formData, [item]: val });
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log(formData);
    const data = new FormData();
    data.append("productImage", file);
    data.append("note", formData.note);

    fetch("/picture", {
      method: "POST",
      headers: { "auth-token": token },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setPicturePage("added");
          history.push("/album");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <Container>
      {albumStatus === "loading" ? (
        <LoadingDiv>
          <Loading />
        </LoadingDiv>
      ) : (
        <PicForm>
          <Title>Add Picture</Title>
          <input
            type="file"
            onChange={(ev) => {
              setFile(ev.target.files[0]);
            }}
          ></input>
          <Text
            placeholder="Add a note to your picture."
            onChange={(ev) => handleChange(ev.target.value, "note")}
          />
          <Button disabled={buttonState} onClick={handleSubmit}>
            Submit
          </Button>
        </PicForm>
      )}

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

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30vh;
`;
const PicForm = styled.form`
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
`;
const Title = styled.p`
  font-size: 38px;
  font-weight: bold;
  margin-bottom: 20px;
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

const Text = styled.textarea`
  height: 200px;
  font-size: large;
  padding: 10px;
  margin-bottom: 10px;
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
export default PictureForm;
