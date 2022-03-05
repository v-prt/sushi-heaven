import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";

const Home = () => {
  return (
    <Wrapper>
      <Title>Sushi Heaven</Title>
      <GameLink to="/game">Let's play!</GameLink>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  place-content: center;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 5rem;
  font-family: "Emilys Candy";
  text-shadow: 0 0 10px #fff;
  text-align: center;
  color: #fff;
`;

const GameLink = styled(Link)`
  background: #66b5ff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  margin: 20px auto;
  width: fit-content;
  &:hover {
    background: #fff;
    color: #66b5ff;
  }
`;

export default Home;
