import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Home = () => {
  return (
    <Wrapper>
      <Title>Cookie Heaven</Title>
      <Link to="/game">~ Start Game ~</Link>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  display: grid;
  place-content: center;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 5rem;
  margin-bottom: 32px;
  font-family: "Emilys Candy";
  text-shadow: 0 0 10px white;
`;

export default Home;
