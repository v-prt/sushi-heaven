import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";

const Home = () => {
  return (
    <Wrapper>
      <Title>Sushi Heaven</Title>
      <Link to="/game" className="action">
        Let's play!
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  place-content: center;
  height: 100vh;
  .action {
    background: #373737;
    font-family: "Raleway", sans-serif;
    font-weight: bold;
    font-size: 0.9rem;
    color: #fff;
    width: fit-content;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    padding: 10px;
    margin: 20px auto;
    border-radius: 10px;
    transition: 0.3s ease-in-out;
    cursor: pointer;
    .icon {
      display: grid;
      margin-right: 5px;
      font-size: 1.1rem;
    }
    &:hover,
    &:focus {
      outline: none;
      background: #fd6743;
      color: white;
    }
  }
`;

const Title = styled.h1`
  font-size: 5rem;
  font-family: "Emilys Candy";
  text-align: center;
  color: #fd6743;
`;

export default Home;
