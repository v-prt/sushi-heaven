import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Home = () => {
  return (
    <Wrapper>
      <Title>Cookie Heaven</Title>
      <GameLink to="/game">~ Go to Game ~</GameLink>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 5rem;
  font-family: "Emilys Candy";
  text-shadow: 0 0 10px white;
`;

const GameLink = styled(Link)`
  width: auto;
  &:hover {
    background: transparent;
    color: #ff4da6;
  }
`;

export default Home;
