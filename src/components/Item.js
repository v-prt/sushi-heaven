import React, { useRef } from 'react'
import styled from 'styled-components/macro'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'

import megaCursor from '../assets/mega-cursor.svg'
import autoCursor from '../assets/auto-cursor.svg'
import jiro from '../assets/jiro.svg'
import farm from '../assets/farm.svg'
import factory from '../assets/factory.svg'

import cart from '../assets/cart.svg'
import truck from '../assets/truck.svg'
import bar from '../assets/bar.svg'
import restaurant from '../assets/restaurant.svg'
import franchise from '../assets/franchise.svg'

export const Item = ({ item, type, cost, currency, available, numOwned, purchase }) => {
  const upgradeIcons = { megaCursor, autoCursor, jiro, farm, factory }
  const restaurantIcons = { cart, truck, bar, restaurant, franchise }
  const upgrade = useRef(null)

  return (
    <Wrapper id={item.id} ref={upgrade}>
      <ItemDetails>
        <div className='header'>
          {type === 'upgrade' && <img src={upgradeIcons[item.id]} alt='' />}
          {type === 'restaurant' && <img src={restaurantIcons[item.id]} alt='' />}
          <Name>{item.name}</Name>
        </div>
        <div className='info'>
          <p>
            {type === 'restaurant' ? (
              <>
                Sells <b>{item.value}</b> sushi per click
              </>
            ) : item.id === 'megaCursor' ? (
              <>
                Increases sushi per click by <b>{item.value}</b>
              </>
            ) : (
              <>
                Produces <b>{item.value}</b> sushi per second
              </>
            )}
          </p>
          {item.stock && (
            <p>
              Sushi stock limit: <b>+{item.stock}</b>
            </p>
          )}
        </div>
        <div className='purchase'>
          <BuyBtn
            className={type === 'restaurant' && 'coins'}
            onClick={purchase}
            disabled={!available}>
            Buy
          </BuyBtn>
          <Cost className={!available && 'not-available'}>
            <RiMoneyDollarCircleLine /> {cost} {currency}
          </Cost>
        </div>
      </ItemDetails>
      <NumOwned className={numOwned === 0 && 'none'}>
        {numOwned}
        <span>owned</span>
      </NumOwned>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: #fff;
  width: 100%;
  padding: 10px;
  border: 1px dotted #ccc;
  border-radius: 5px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .info {
    color: #666;
    margin-bottom: 5px;
    font-size: 0.8rem;
    b {
      color: #373737;
    }
  }
  .purchase {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
  }
  @media only screen and (min-width: 800px) {
    margin: 5px 0;
    .info {
      margin-bottom: 10px;
    }
    .purchase {
      font-size: 1rem;
    }
  }
`

const ItemDetails = styled.div`
  text-align: left;
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    img {
      height: 20px;
      margin-right: 10px;
    }
  }
  @media only screen and (min-width: 800px) {
    .header {
      margin-bottom: 10px;
      img {
        height: 25px;
      }
    }
  }
`

const Name = styled.p`
  font-family: 'Merienda', cursive;
  font-weight: bold;
  font-size: 1rem;
  color: #1a1a1a;
  @media only screen and (min-width: 800px) {
    font-size: 1.2rem;
  }
`

const BuyBtn = styled.button`
  background: #ff6db6;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  border: none;
  padding: 2px 5px 4px 5px;
  margin-right: 10px;
  transition: 0.1s ease-in-out;
  border-radius: 5px;
  cursor: pointer;
  &.coins {
    background: gold;
  }
  &:not(:active) {
    box-shadow: -2px 2px 0 #333;
    transform: translate(0.25em, -0.25em);
  }
  &:disabled {
    background: #e6e6e6;
    box-shadow: none;
    transform: none;
    pointer-events: none;
  }
  @media only screen and (min-width: 800px) {
    font-size: 0.9rem;
    padding: 5px 10px;
  }
`

const Cost = styled.p`
  color: #373737;
  display: flex;
  align-items: center;
  &.not-available {
    color: #fe5a58;
  }
`

const NumOwned = styled.div`
  color: #373737;
  font-weight: bold;
  font-size: 1.5rem;
  display: grid;
  place-content: center;
  text-align: center;
  &.none {
    color: #ccc;
  }
  span {
    font-size: 0.8rem;
  }
  @media only screen and (min-width: 800px) {
    font-size: 2rem;
  }
`
