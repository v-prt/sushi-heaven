import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

export const Home = () => {
  return (
    <Wrapper>
      <Title>Sushi Heaven</Title>
      <Introduction>
        <p>
          You're a young sushi chef who dreams of someday owning their own franchise. Using the last
          of your savings, you've purchased a cart to sell your sushi on the streets.
        </p>
        <p>Set out and start making that sushi!</p>
        <p className='info'>
          Your progress will automatically be saved and any sushi produced while you're away will be
          added to your supply when you return.
        </p>
      </Introduction>
      <Link to='/game' className='action'>
        Let's play!
      </Link>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  place-content: center;
  height: 100vh;
  .action {
    background: #373737;
    font-family: 'Raleway', sans-serif;
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
      background: #fe5a58;
      color: white;
    }
  }
`

const Title = styled.h1`
  font-size: 5rem;
  font-family: 'Emilys Candy';
  text-align: center;
  color: #fe5a58;
`

const Introduction = styled.div`
  background: rgba(255, 255, 255, 0.7);
  border: 5px solid #fff;
  border-radius: 5px;
  max-width: 500px;
  margin: 20px;
  padding: 40px;
  text-align: center;
  p {
    margin: 10px 0;
    &.info {
      color: rgba(0, 0, 0, 0.5);
      font-size: 0.8rem;
    }
  }
`
