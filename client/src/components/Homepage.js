import React, { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router-dom";
import { ReactComponent as SVG1 } from "../svg/vector-1-1.svg";
import { ReactComponent as SVG2 } from "../svg/vector-1-2.svg";

import styled from "styled-components";

const Homepage = () => {
  const { token, setUser } = useContext(UserContext);
  const history = useHistory();

  // useEffect(() => {
  //   if (token !== null) {
  //     fetch("/profile", {
  //       method: "GET",
  //       headers: { "auth-token": token },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data);
  //         setUser(data);
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }
  // }, [token]);

  return (
    <Container>
      <Wrapper>
        <Title>Pawgram</Title>
        <Info>A social media platform for your pet.</Info>
        {token !== null ? (
          <Button
            onClick={() => {
              history.push("/pets");
            }}
          >
            Get Started
          </Button>
        ) : (
          <Button
            onClick={() => {
              history.push("/signup");
            }}
          >
            Get Started
          </Button>
        )}
      </Wrapper>
      <IllustrationDiv>
        <SVG1Div>
          <SVG1 style={{ display: "block" }} />
        </SVG1Div>
        <SVG2Div>
          <SVG2 style={{ display: "block" }} />
        </SVG2Div>

        <Cat1 className="desktop2" alt="cat1" src="/assets/cat1.png" />
        <Cat2 className="desktop3" alt="cat2" src="/assets/cat2.png" />
        <Plant1 className="desktop" alt="plant1" src="/assets/plant1.png" />
        <Plant2 className="desktop2" alt="plant2" src="/assets/plant2.png" />
        <Dog1 alt="dog1" src="/assets/dog1.png" />
        <Plant3 className="desktop3" alt="plant3" src="/assets/plant3.png" />
      </IllustrationDiv>
    </Container>
  );
};

const Container = styled.div`
  margin: 15vh 0px;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Wrapper = styled.div`
  padding: 20px;
  width: fit-content;
  margin: 5vh auto;
  z-index: 5;
`;

const Title = styled.p`
  font-size: 72px;
  font-weight: bold;
`;

const Info = styled.p`
  font: 42px;
`;

const Button = styled.button`
  margin-top: 50px;
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
const Cat1 = styled.img`
  width: 300px;
  z-index: 3;
  position: absolute;
  bottom: 0;
  left: 10%;
`;

const Cat2 = styled.img`
  width: 300px;
  z-index: 3;
  position: absolute;
  bottom: 0px;
  left: 30%;

  @media (max-width: 930px) {
    left: 10%;
  }
`;

const Plant1 = styled.img`
  height: 200px;
  z-index: 3;
  position: absolute;
  bottom: 0px;
  right: 45%;
`;

const Plant2 = styled.img`
  height: 300px;
  z-index: 3;
  position: absolute;
  bottom: 0px;
  right: 35%;
  z-index: 1;
`;
const Dog1 = styled.img`
  width: 400px;
  z-index: 3;
  position: absolute;
  bottom: 0px;
  right: 10%;
`;

const Plant3 = styled.img`
  height: 500px;
  z-index: 3;
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 1;
`;

const IllustrationDiv = styled.div`
  width: fit-content;

  @media (max-width: 768px) and (max-width: 1200px) {
    .desktop {
      display: none;
    }
  }
  @media (min-width: 600px) and (max-width: 930px) {
    .desktop {
      display: none;
    }
    .desktop2 {
      display: none;
    }
  }

  @media (max-width: 600px) {
    .desktop {
      display: none;
    }
    .desktop2 {
      display: none;
    }
    .desktop3 {
      display: none;
    }
  }
`;

const SVG1Div = styled.div`
  position: absolute;
  right: 0px;
  bottom: 0px;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  pointer-events: none;
  z-index: -1;
  @media (max-width: 768px) {
    display: none;
  }
`;

const SVG2Div = styled.div`
  position: absolute;
  left: 0px;
  bottom: 0px;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  pointer-events: none;
  z-index: -1;

  @media (max-width: 930px) {
    display: none;
  }
`;
export default Homepage;
