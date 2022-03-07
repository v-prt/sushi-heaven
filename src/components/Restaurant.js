import React from 'react'
import styled from 'styled-components/macro'

import cart from '../assets/cart.svg'
import truck from '../assets/truck.svg'
import bar from '../assets/bar.svg'
import restaurant from '../assets/restaurant.svg'
import franchise from '../assets/franchise.svg'
// import bill from '../assets/bill.svg'
import chopsticks from '../assets/chopsticks.svg'

export const Restaurant = ({ item, numOwned, ready, handleSell }) => {
  const restaurantIcons = { cart, truck, bar, restaurant, franchise }

  return numOwned > 0 ? (
    <Wrapper key={item.id} numOwned={numOwned}>
      <Alert onClick={() => handleSell(item)} ready={ready}>
        <img src={chopsticks} alt='' />
        <span className='arrow' />
      </Alert>
      <img src={restaurantIcons[item.id]} alt={item.name} />
    </Wrapper>
  ) : (
    <></>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 20px;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px;
  border-radius: 10px;
  flex: 1;
  position: relative;
  img {
    height: 50px;
    margin: 5px;
  }
  .name {
    font-size: 0.8rem;
    font-weight: bold;
    margin: 5px;
  }
`

const Alert = styled.span`
  display: ${props => (props.ready ? 'block' : 'none')};
  padding: 5px;
  background: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  position: absolute;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 0.8rem;
  left: -60px;
  cursor: pointer;
  img {
    height: 30px;
    animation: wiggle 0.7s infinite ease-in-out;
    @keyframes wiggle {
      0% {
        transform: rotate(0deg);
      }
      25% {
        transform: rotate(10deg);
      }
      50% {
        transform: rotate(0deg);
      }
      75% {
        transform: rotate(-10deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }
  }
  .arrow {
    background: #fff;
    height: 7px;
    width: 7px;
    transform: rotate(45deg);
    position: absolute;
    right: -3px;
    bottom: 21px;
  }
`
