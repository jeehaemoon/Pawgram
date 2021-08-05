import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import { useParams } from "react-router";
import { useHistory, NavLink } from "react-router-dom";
import Loading from "../Loading";

const initialState = {
  comment: "",
};
const Picture = () => {
  const { token, setUser, user } = useContext(UserContext);
  const [pictureData, setPictureData] = useState(undefined);
  const [pictureStatus, setPictureStatus] = useState("loading");
  const [formData, setFormData] = useState(initialState);
  const [comments, setComments] = useState(undefined);
  const [userStatus, setUserStatus] = useState("loading");
  const { _id } = useParams();
  const history = useHistory();

  const handleChange = (val, item) => {
    setFormData({ ...formData, [item]: val });
  };
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
    fetch(`/pictures/${_id}`, {
      method: "GET",
      headers: { "auth-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        setPictureData(data.data);
        setPictureStatus("idle");
        setComments("idle");
      })
      .catch((err) => {
        console.error(err);
      });
  }, [comments]);

  //function that handles Comments

  const handleComment = () => {
    fetch(`/pictures/${_id}/comment`, {
      method: "POST",
      headers: { "auth-token": token, "Content-Type": "application/json" },
      body: JSON.stringify({ comment: formData.comment }),
    })
      .then((res) => res.json())
      .then((data) => {
        setComments("added");
      })
      .catch((err) => {
        console.error(err);
      });

    setFormData(initialState);
  };

  //function that deletes comment
  const deleteComment = (commmentId) => {
    setComments("idle");

    fetch(`/pictures/${_id}/delete-comment`, {
      method: "PUT",
      headers: { "auth-token": token, "Content-Type": "application/json" },
      body: JSON.stringify({ _id: commmentId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setComments("deleted");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //function to delete picture
  const deletePicture = () => {
    fetch(`/delete-post/${_id}`, {
      method: "PUT",
      headers: { "auth-token": token, "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        history.push("/album");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <Container>
      {pictureStatus === "loading" || userStatus === "loading" ? (
        <LoadingDiv>
          <Loading />
        </LoadingDiv>
      ) : (
        <Wrapper>
          <div>
            <Img alt="pic" src={pictureData.src} />
          </div>
          <Info>
            <Date>
              <div>{pictureData.date}</div>
              <div>{pictureData.time}</div>
            </Date>
            <div>{pictureData.note}</div>
          </Info>
          {pictureData.comments.length === 0 ? null : (
            <div>
              {pictureData.comments.map((comment, index) => {
                return (
                  <Comment key={index}>
                    <Username>@{comment.username}</Username>
                    <CommentInfo>
                      <div>{comment.comment}</div>
                      {/* only author of the comment can delete */}
                      {comment.author === user._id ? (
                        <DeleteComment
                          onClick={() => deleteComment(comment._id)}
                        >
                          Delete
                        </DeleteComment>
                      ) : null}
                    </CommentInfo>
                  </Comment>
                );
              })}
            </div>
          )}
          <InputField>
            <Input
              type="text"
              onChange={(ev) => handleChange(ev.target.value, "comment")}
              value={formData.comment}
            />
            <CommentButton onClick={() => handleComment()}>
              Comment
            </CommentButton>
          </InputField>
          {pictureData.owner === user._id ? (
            <DeleteButton onClick={() => deletePicture()}>
              Delete Picture
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
const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
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

const Img = styled.img`
  width: 100%;
`;

const Info = styled.div`
  border-bottom: 4px solid black;
  padding: 5px;
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

const Date = styled.div`
  display: flex;
  color: gray;
  font-size: smaller;
  div {
    margin-right: 10px;
  }
`;

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  padding: 5px;
`;

const CommentInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const InputField = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const Input = styled.input`
  width: 90%;
  border: 1px solid black;
  padding: 5px;
`;

const DeleteComment = styled.button`
  border: 1px solid black;
  background-color: white;
  :active {
    -webkit-box-shadow: inset 0px 0px 5px #c1c1c1;
    -moz-box-shadow: inset 0px 0px 5px #c1c1c1;
    box-shadow: inset 0px 0px 5px #c1c1c1;
    outline: none;
  }
`;

const CommentButton = styled.button`
  border: 1px solid black;
  background-color: white;
  :active {
    -webkit-box-shadow: inset 0px 0px 5px #c1c1c1;
    -moz-box-shadow: inset 0px 0px 5px #c1c1c1;
    box-shadow: inset 0px 0px 5px #c1c1c1;
    outline: none;
  }
`;

const Username = styled.div`
  color: gray;
  font-size: smaller;
`;
export default Picture;
