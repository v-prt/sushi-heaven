import React, { useRef } from 'react'
import styled from 'styled-components/macro'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'

export const Item = ({ item, type, cost, currency, available, numOwned, buyUpgrade }) => {
  const upgrade = useRef(null)

  const itemUse = () => {
    if (type === 'restaurant') {
      return `Sells ${item.value} sushi per second.`
    } else if (item.id === 'megaCursor') {
      return `Increases sushi per click by ${item.value}.`
    } else {
      return `Produces ${item.value} sushi per second.`
    }
  }

  return (
    <Wrapper id={item.id} ref={upgrade}>
      <ItemDetails>
        <Name>{item.name}</Name>
        <div className='purchase'>
          <BuyBtn
            className={type === 'restaurant' && 'coin'}
            onClick={buyUpgrade}
            disabled={!available}>
            Buy
          </BuyBtn>
          <div className='info'>
            <Cost className={!available && 'not-available'}>
              <RiMoneyDollarCircleLine /> {cost} {currency}
            </Cost>
            <Use>{itemUse()}</Use>
          </div>
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
  color: #1a1a1a;
  width: 100%;
  padding: 10px;
  border: 1px dotted #ccc;
  border-radius: 5px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .purchase {
    display: flex;
    align-items: center;
  }
`

const ItemDetails = styled.div`
  text-align: left;
`

const Name = styled.p`
  font-family: 'Merienda', cursive;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
`

const BuyBtn = styled.button`
  background: #ff6db6;
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
  border: none;
  padding: 5px 10px;
  margin-right: 10px;
  transition: 0.1s ease-in-out;
  border-radius: 5px;
  cursor: pointer;
  &.coin {
    background: gold;
  }
  &:hover:not(:active) {
    box-shadow: -2px 2px 0 #333;
    transform: translate(0.25em, -0.25em);
  }
  &:disabled {
    background: #e6e6e6;
    box-shadow: none;
    transform: none;
    pointer-events: none;
  }
`

const Cost = styled.p`
  color: #373737;
  display: flex;
  align-items: center;
  &.not-available {
    color: #fd6743;
  }
`

const Use = styled.p`
  font-size: 0.8rem;
  color: #666;
`

const NumOwned = styled.div`
  color: #373737;
  font-weight: bold;
  font-size: 2rem;
  display: grid;
  place-content: center;
  text-align: center;
  &.none {
    color: #ccc;
  }
  span {
    font-size: 0.8rem;
  }
`
