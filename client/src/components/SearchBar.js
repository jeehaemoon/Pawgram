import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { NavLink, useHistory } from "react-router-dom";
import styled from "styled-components";

const SearchBar = () => {
  const { token, setUser, user } = useContext(UserContext);
  const [searchValue, setSearchValue] = useState("");
  const [itemList, setItemList] = useState(undefined);
  const [userStatus, setUserStatus] = useState("loading");
  const history = useHistory();

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

  useEffect(() => {
    fetch("/users", {
      method: "GET",
      headers: { "auth-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setItemList(data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const suggestionsMatch =
    itemList &&
    itemList.filter((item) => {
      if (searchValue.length >= 2) {
        return item.username.toLowerCase().includes(searchValue.toLowerCase());
      } else {
        return "";
      }
    });
  const getItemPage = (userId) => {
    history.push(`/friends/${userId}`);
    setSearchValue("");
  };
  return (
    <div>
      <Input
        value={searchValue}
        placeholder="Search for a friend!"
        onChange={(ev) => setSearchValue(ev.target.value)}
        disabled={!itemList}
      />
      <Ul>
        {suggestionsMatch && (
          <Wrapper>
            {suggestionsMatch.map((suggestion, index) => {
              const item = suggestion.username;
              const cutOff = item.indexOf(searchValue) + searchValue.length;
              const firstHalf = item.slice(0, cutOff);
              const secondHalf = item.slice(cutOff);

              return (
                <div
                  key={index}
                  onClick={() => {
                    getItemPage(suggestion._id);
                  }}
                >
                  <Li key={suggestion._id}>
                    <span>
                      {firstHalf}
                      <strong>{secondHalf}</strong>
                    </span>
                  </Li>
                </div>
              );
            })}
          </Wrapper>
        )}
      </Ul>
    </div>
  );
};

const Input = styled.input`
  width: 200px;
  padding: 5px;
  &:focus {
    outline: none;
  }
  font-size: large;
  font-weight: bold;
  background-color: white;
  z-index: 5;
  box-shadow: 3px -3px black, 2px -2px black, 1px -1px black;
  border: 1px solid black;
`;

const Ul = styled.ul`
  position: absolute;
  max-height: 200px;
  width: 200px;
  overflow-y: scroll;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 10px;
  background: white;
`;

const Li = styled.li`
  width: 100%;
  padding: 2.5px 5px;
  border: 1px solid black;
  &:hover {
    background: #56acf5;
    color: white;
  }
`;

const Wrapper = styled.div``;

export default SearchBar;
