import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <Container>
      <div>
        All illustrations by{" "}
        <a href="https://blush.design/collections/40G09koP55fYh86yZDnX/stuck-at-home">
          Mariana Gonzalez Vega
        </a>
      </div>
    </Container>
  );
};
const Container = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 10px;
  padding: 10px;
  background-color: #fdfbc6;
`;

export default Footer;
