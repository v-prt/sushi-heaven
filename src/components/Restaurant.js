import React, { useRef } from 'react'
import styled from 'styled-components/macro'
import { BsFillPatchExclamationFill } from 'react-icons/bs'

import cart from '../assets/cart.svg'
import truck from '../assets/truck.svg'
import bar from '../assets/bar.svg'
import restaurant from '../assets/restaurant.svg'
import franchise from '../assets/franchise.svg'
import chopsticks from '../assets/chopsticks.svg'

export const Restaurant = ({ item, numOwned, ready, sellSushi }) => {
  const restaurantIcons = { cart, truck, bar, restaurant, franchise }
  const coinsRef = useRef(null)
  let coinsPerClick = item.value * numOwned

  const displayPoints = () => {
    coinsRef.current.style.opacity = '1'
    setTimeout(() => {
      coinsRef.current.style.opacity = '0'
    }, 100)
  }

  return (
    <Wrapper key={item.id} owned={numOwned > 0}>
      <Alert
        onClick={() => {
          sellSushi(item)
          displayPoints()
        }}
        ready={ready && numOwned > 0}>
        <Points ref={coinsRef}>+ ${coinsPerClick}</Points>
        <span className='icon'>
          <BsFillPatchExclamationFill />
        </span>
        <img className='chopsticks' src={chopsticks} alt='' />
        <span className='arrow' />
      </Alert>
      <img src={restaurantIcons[item.id]} alt={item.name} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  opacity: ${props => (props.owned ? '1' : '0.5')};
  filter: ${props => (props.owned ? '' : 'grayscale(1)')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 10px;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px;
  border-radius: 10px;
  flex: 1;
  position: relative;
  img {
    height: 70px;
    margin: 10px;
  }
  @media only screen and (min-width: 800px) {
    flex: none;
  }
`

const Alert = styled.span`
  display: ${props => (props.ready ? 'flex' : 'none')};
  padding: 5px;
  background: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  position: absolute;
  align-items: center;
  font-weight: bold;
  font-size: 0.8rem;
  top: -70px;
  cursor: pointer;
  .icon {
    color: #fe5a58;
    position: absolute;
    top: 5px;
  }
  .chopsticks {
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
    bottom: -4px;
    right: 25px;
  }
  @media only screen and (min-width: 800px) {
    top: 25px;
    left: -70px;
    .arrow {
      bottom: 25px;
      right: -4px;
    }
  }
`

const Points = styled.p`
  color: white;
  opacity: 0;
  position: absolute;
  top: -30px;
  width: fit-content;
  z-index: 10;
  font-size: 1rem;
  font-weight: bold;
  text-shadow: 0 0 5px gold;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  transition: 0.1s ease-in-out;
`
