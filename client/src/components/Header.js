import React, { useContext, useState } from "react";
import styled, { keyframes } from "styled-components";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";

const Header = () => {
  const { user, token } = useContext(UserContext);
  const [hamburgerStatus, setHamburgerStatus] = useState(false);
  const history = useHistory();

  const activateHamburger = () => {
    setHamburgerStatus(!hamburgerStatus);
  };
  return (
    <Container>
      <NavLinkItem exact to="/">
        <Logo>
          <Img alt="logo" src="/assets/logo.png" />
          <p>Pawgram</p>
        </Logo>
      </NavLinkItem>
      {user !== undefined ? (
        <Wrapper>
          <Hamburger
            className="mobile"
            alt="menu"
            src="/assets/menu.png"
            onClick={() => activateHamburger()}
          />
          {hamburgerStatus ? (
            <HamburgerMenu className="mobile">
              <ul>
                <div onClick={() => activateHamburger()}>
                  <img alt="close" src="/assets/close.png" />
                </div>
                <NavLinkHamburger
                  exact
                  to="/pets"
                  onClick={() => activateHamburger()}
                >
                  My Pets
                </NavLinkHamburger>
                <NavLinkHamburger
                  exact
                  to="/friends"
                  onClick={() => activateHamburger()}
                >
                  Friends
                </NavLinkHamburger>
                <NavLinkHamburger
                  exact
                  to="/album"
                  onClick={() => activateHamburger()}
                >
                  Album
                </NavLinkHamburger>
                <HamLogout
                  exact
                  to="/"
                  onClick={() => {
                    activateHamburger();
                    localStorage.removeItem("token");
                    history.push("/");
                    window.location.reload();
                  }}
                >
                  Log Out
                </HamLogout>
              </ul>
            </HamburgerMenu>
          ) : null}
          <NavLinkItem
            className="desktop"
            exact
            to="/pets"
            activeClassName="selected"
          >
            My Pets
          </NavLinkItem>
          <NavLinkItem
            className="desktop"
            exact
            to="/friends"
            activeClassName="selected"
          >
            Friends
          </NavLinkItem>
          <NavLinkItem
            className="desktop"
            exact
            to="/album"
            activeClassName="selected"
          >
            Album
          </NavLinkItem>
          <Name className="desktop">
            {user.username}
            <Dropdown
              onClick={() => {
                localStorage.removeItem("token");
                history.push("/");
                window.location.reload();
              }}
            >
              Log Out
            </Dropdown>
          </Name>
        </Wrapper>
      ) : (
        <Wrapper2>
          <NavLinkItem exact to="/login" activeClassName="selected">
            Log In
          </NavLinkItem>
        </Wrapper2>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: fit-content;
  /* border: 1px solid black; */
  display: flex;
  background-color: white;
  justify-content: space-between;
  align-items: center;
  z-index: 5000;
  font-size: large;
  padding: 10px;
`;

const Logo = styled.div`
  margin-left: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  p {
    margin-left: 10px;
  }
  @media (max-width: 768px) {
    margin-left: 50px;
  }
`;

const Img = styled.img`
  width: 50px;
  height: 50px;
`;

const translate = keyframes`
  from{
    transform: translate(100px);
  }
  to {
    transform: rotate(0px);
  }
  

`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 25%;
  margin-right: 100px;
  font-weight: bolder;
  @media (max-width: 900px) {
    margin-right: 50px;
    margin-left: 50px;
    width: fit-content;
  }
  @media (min-width: 900px) and (max-width: 1300px) {
    width: 35%;
    margin-right: 50px;
    margin-left: 50px;
  }
  .desktop {
    @media (max-width: 900px) {
      display: none;
    }
  }
  .mobile {
    @media (min-width: 900px) {
      display: none;
    }
  }
`;

const Wrapper2 = styled.div`
  display: flex;
  justify-content: space-around;
  margin-right: 100px;
  font-weight: bolder;
`;

const NavLinkItem = styled(NavLink)`
  text-decoration: none;
  color: black;
  &.selected {
    border-bottom: 5px solid #56acf5;
  }
`;

const Name = styled.div`
  &:hover {
    display: block;
    > div {
      display: block;
    }
  }
`;

const Dropdown = styled.div`
  display: none;
  position: absolute;
  /* background-color: #2cade0; */
  width: 100%;
  color: #fc7750;
  /* padding: 10px; */
  cursor: pointer;
`;

const Hamburger = styled.img`
  width: 30px;
  height: 30px;
`;

const HamburgerMenu = styled.div`
  display: flex;
  font-size: xx-large;

  img {
    width: 30px;
    height: 30px;
    margin-bottom: 20px;
  }
  ul {
    display: flex;
    flex-flow: column nowrap;
    background-color: white;
    position: fixed;
    text-align: right;
    top: 0;
    right: 0;
    height: 100vh;
    width: 300px;
    padding-top: 2rem;
    padding-right: 2rem;

    animation-name: ${translate};
    animation-duration: 0.5s;
    animation-iteration-count: 1;
  }
`;

const NavLinkHamburger = styled(NavLink)`
  text-decoration: none;
  color: black;
  line-height: 2;
  :hover {
    color: #56acf5;
  }
`;

const HamLogout = styled.div`
  text-decoration: none;
  color: black;
  margin-top: 30%;
  :hover {
    color: #fc7750;
  }
`;

export default Header;
