import React, { useContext } from "react";
import styled from "styled-components";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";

const Header = () => {
  const { user, token } = useContext(UserContext);
  const history = useHistory();
  return (
    <Container>
      <NavLinkItem exact to="/">
        <Logo>
          <Img alt="logo" src="/assets/logo.png" />
          <p> My Pet App</p>
        </Logo>
      </NavLinkItem>

      {user !== undefined ? (
        <Wrapper>
          <NavLinkItem exact to="/pets" activeClassName="selected">
            My Pets
          </NavLinkItem>
          <NavLinkItem exact to="/friends" activeClassName="selected">
            Friends
          </NavLinkItem>
          <NavLinkItem exact to="/album" activeClassName="selected">
            Album
          </NavLinkItem>
          <Name>
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
`;

const Img = styled.img`
  width: 50px;
  height: 50px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 30%;
  margin-right: 100px;
  font-weight: bolder;
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

export default Header;
