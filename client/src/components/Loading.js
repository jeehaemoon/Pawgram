import React from "react";
import styled, { keyframes } from "styled-components";

const Loading = () => {
  return <LoadingIcon alt="loading" src="/assets/yarn.png" />;
};

const rotation = keyframes`
  from{
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
  

`;
const LoadingIcon = styled.img`
  width: 50px;
  height: 50px;
  animation-name: ${rotation};
  animation-duration: 3s;
  animation-iteration-count: infinite;
`;
export default Loading;
